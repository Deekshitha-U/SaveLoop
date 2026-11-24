import { detectPlatform, titleFromUrl } from './platformService.js';
import { normalizeUrl } from '../utils/urlUtils.js';
import { parseTags } from '../utils/hashtagUtils.js';

// SaveLoop NEVER requests user-pasted URLs directly. All outbound calls here go
// to fixed, trusted provider API hosts. This avoids backend SSRF via private IPs,
// user-controlled DNS, redirects, or untrusted HTML. No video is downloaded.
const MAX_BYTES = 250_000;
const clean = (value, max = 1200) => typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';
const hashtags = (text) => parseTags((String(text || '').match(/#[a-z0-9_-]+/gi) || []));

async function trustedJson(endpoint, options = {}) {
  const target = new URL(endpoint);
  const allowed = new Set(['www.googleapis.com', 'www.youtube.com', 'graph.facebook.com', 'api.pinterest.com', 'api.microlink.io', 'pro.microlink.io']);
  if (target.protocol !== 'https:' || !allowed.has(target.hostname)) throw new Error('Metadata API host not approved');
  const response = await fetch(target, {
    method: 'GET', redirect: 'error',
    headers: { Accept: 'application/json', ...options.headers },
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`Provider did not supply metadata (HTTP ${response.status})`);
  if (Number(response.headers.get('content-length')) > MAX_BYTES) throw new Error('Metadata response too large');
  const reader = response.body?.getReader();
  if (!reader) return response.json();
  let size = 0;
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) throw new Error('Metadata response too large');
      chunks.push(value);
    }
  } finally { await reader.cancel().catch(() => {}); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function youtubeId(url) {
  const parsed = new URL(url);
  const hostname = parsed.hostname.replace(/^www\./, '');
  const sections = parsed.pathname.split('/').filter(Boolean);
  const raw = hostname === 'youtu.be' ? sections[0] :
    sections[0] === 'watch' ? parsed.searchParams.get('v') :
    ['shorts', 'embed', 'live'].includes(sections[0]) ? sections[1] : null;
  return /^[\w-]{11}$/.test(raw || '') ? raw : null;
}
function pinterestId(url) {
  const match = new URL(url).pathname.match(/\/pin\/(\d+)/);
  return match?.[1] || null;
}
function looksLikeMetadataTitle(title, platform) {
  if (!title) return false;
  const lower = title.toLowerCase();
  if (lower === 'instagram' || lower === 'facebook' || lower === 'pinterest') return false;
  if (lower === platform) return false;
  return true;
}

export async function getPermittedMetadata(input) {
  const url = normalizeUrl(input);
  const platform = detectPlatform(url);
  const fallback = {
    platform, title: '', description: '', tags: [], thumbnailUrl: '',
    status: 'limited', source: 'none',
    message: `We couldn't access enough ${platform === 'website' ? 'page' : 'post'} information to categorise this link. Add a title or a few hashtags, or save it as Uncategorised.`,
  };
  try {
    if (platform === 'youtube') {
      const id = youtubeId(url);
      if (!id) return { ...fallback, message: 'This YouTube URL is not a supported video link. You can still save it manually.' };
      if (process.env.YOUTUBE_API_KEY) {
        try {
          const endpoint = new URL('https://www.googleapis.com/youtube/v3/videos');
          endpoint.searchParams.set('part', 'snippet');
          endpoint.searchParams.set('id', id);
          endpoint.searchParams.set('key', process.env.YOUTUBE_API_KEY);
          const data = await trustedJson(endpoint.toString());
          const snippet = data?.items?.[0]?.snippet;
          if (snippet?.title) return {
            ...fallback, status: 'available', source: 'youtube-data-api',
            title: clean(snippet.title, 200), description: clean(snippet.description),
            tags: parseTags([...(snippet.tags || []), ...hashtags(snippet.description)]),
            thumbnailUrl: snippet.thumbnails?.medium?.url || '',
            message: 'Title, description and available tags were retrieved from YouTube.',
          };
        } catch { /* Fall back to supported public oEmbed title. */ }
      }
      const endpoint = new URL('https://www.youtube.com/oembed');
      endpoint.searchParams.set('url', `https://www.youtube.com/watch?v=${id}`);
      endpoint.searchParams.set('format', 'json');
      const embed = await trustedJson(endpoint.toString());
      if (embed?.title) return {
        ...fallback, status: 'partial', source: 'youtube-oembed', title: clean(embed.title, 200),
        thumbnailUrl: embed.thumbnail_url || '',
        message: 'The video title was found. Description and hashtags require YouTube Data API access; you may add them manually.',
      };
    }
    if (platform === 'pinterest') {
      const id = pinterestId(url);
      if (!id) return { ...fallback, message: 'This Pinterest URL cannot be resolved to a Pin ID. Please add the details manually.' };
      if (!process.env.PINTEREST_ACCESS_TOKEN) return { ...fallback, message: 'Pinterest limits Pin details to authorised API access. Add a title or hashtags manually, or save as Uncategorised.' };
      const pin = await trustedJson(`https://api.pinterest.com/v5/pins/${id}`, { headers: { Authorization: `Bearer ${process.env.PINTEREST_ACCESS_TOKEN}` } });
      const description = clean(pin?.description || pin?.alt_text);
      const title = clean(pin?.title, 200);
      if (title || description) return {
        ...fallback, status: title ? 'available' : 'partial', source: 'pinterest-api', title, description,
        tags: hashtags(description),
        message: 'Retrieved permitted Pin details using Pinterest API access.',
      };
    }
    if (platform === 'instagram' || platform === 'facebook') {
      const version = /^v\d+\.\d+$/.test(process.env.META_GRAPH_VERSION || '') ? process.env.META_GRAPH_VERSION : 'v27.0';
      const path = platform === 'instagram' ? 'instagram_oembed' : /\/videos?\/|watch\//i.test(new URL(url).pathname) ? 'oembed_video' : 'oembed_post';
      const endpoint = new URL(`https://graph.facebook.com/${version}/${path}`);
      endpoint.searchParams.set('url', url);
      endpoint.searchParams.set('omitscript', 'true');
      if (process.env.META_OEMBED_ACCESS_TOKEN) endpoint.searchParams.set('access_token', process.env.META_OEMBED_ACCESS_TOKEN);
      const embed = await trustedJson(endpoint.toString());
      // Meta oEmbed primarily returns embeddable HTML (not a post caption/title).
      // Do not parse the HTML to infer video text; it is not trusted metadata.
      const title = clean(embed?.title, 200);
      if (looksLikeMetadataTitle(title, platform)) return {
        ...fallback, title, source: 'meta-oembed', status: 'partial',
        message: 'The public post title was available, but caption/hashtags are restricted. Add details if you want better categorisation.',
      };
      return { ...fallback, source: 'meta-oembed', message: 'The public post may be embeddable, but Meta did not provide its caption or hashtags. Enter a title or hashtags, or save as Uncategorised.' };
    }
    // Optional website metadata via a dedicated third-party service. URL is sent
    // only to Microlink, not fetched by this Express server. The user explicitly
    // requests analysis or saving; don't transmit restricted social URLs here.
    if (['website', 'github', 'medium'].includes(platform) && (process.env.METADATA_PROVIDER || 'microlink') === 'microlink') {
      const apiKey = process.env.MICROLINK_API_KEY;
      const endpoint = new URL(apiKey ? 'https://pro.microlink.io' : 'https://api.microlink.io');
      endpoint.searchParams.set('url', url);
      const data = await trustedJson(endpoint.toString(), { headers: apiKey ? { 'x-api-key': apiKey } : {} });
      const item = data?.status === 'success' ? data.data : null;
      const title = clean(item?.title, 200);
      const description = clean(item?.description);
      if (title || description) return {
        ...fallback, status: title && description ? 'available' : 'partial', source: 'microlink', title,
        description, tags: hashtags(description),
        thumbnailUrl: typeof item?.image?.url === 'string' ? item.image.url : '',
        message: 'Retrieved publicly available website metadata. Review the suggested details before saving.',
      };
    }
  } catch (error) {
    console.warn(`Metadata unavailable for ${platform}:`, error.message);
  }
  return fallback;
}

// Keeps the original fallback used by existing bookmark CRUD logic.
export function permittedMetadata(url, providedTitle) {
  const platform = detectPlatform(url);
  const guessed = titleFromUrl(url);
  const isOpaque = platform !== 'website' && platform !== 'medium' && platform !== 'github' &&
    (/^[a-zA-Z0-9_-]{8,}$/.test(guessed) || guessed === 'watch' || guessed === 'reel' || guessed === 'pin');
  const title = clean(providedTitle, 200) || (isOpaque ? `Saved ${platform[0].toUpperCase()}${platform.slice(1)} link` : guessed);
  return { title, thumbnail: null, source: 'user-or-url' };
}
