import { normalizeUrl } from '../utils/urlUtils.js';
const hosts = [
  ['youtube', ['youtube.com', 'youtu.be']], ['instagram', ['instagram.com']],
  ['pinterest', ['pinterest.com', 'pin.it']], ['facebook', ['facebook.com', 'fb.com', 'fb.watch']],
  ['linkedin', ['linkedin.com']], ['twitter', ['twitter.com', 'x.com']],
  ['tiktok', ['tiktok.com']], ['medium', ['medium.com']], ['github', ['github.com']],
];
export function detectPlatform(url) {
  const host = new URL(normalizeUrl(url)).hostname.replace(/^www\./, '');
  const match = hosts.find(([, domains]) => domains.some((domain) => host === domain || host.endsWith(`.${domain}`)));
  return match ? match[0] : 'website';
}
export function titleFromUrl(url) {
  const parsed = new URL(url);
  const part = parsed.pathname.split('/').filter(Boolean).at(-1) || parsed.hostname.replace(/^www\./, '');
  let decoded; try { decoded = decodeURIComponent(part); } catch { decoded = part; }
  const cleaned = decoded.replace(/[-_]+/g, ' ').replace(/\.[a-z0-9]{2,5}$/i, '').trim();
  return cleaned.length >= 3 ? cleaned.slice(0, 140) : parsed.hostname;
}
