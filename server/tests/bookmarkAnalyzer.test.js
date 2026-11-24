import test from 'node:test';
import assert from 'node:assert/strict';
import { getPermittedMetadata } from '../src/services/metadataService.js';
import { analyzeBookmark } from '../src/services/bookmarkAnalyzerService.js';

const originalFetch = globalThis.fetch;
const original = {
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  PINTEREST_ACCESS_TOKEN: process.env.PINTEREST_ACCESS_TOKEN,
  METADATA_PROVIDER: process.env.METADATA_PROVIDER,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};
const reset = () => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(original)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
};

test('YouTube public oEmbed returns a real title but no made-up tags', async () => {
  delete process.env.YOUTUBE_API_KEY;
  globalThis.fetch = async (url) => {
    assert.equal(new URL(url).hostname, 'www.youtube.com');
    return new Response(JSON.stringify({ title: 'React Hooks Explained', thumbnail_url: 'https://i.ytimg.com/a.jpg' }), { status: 200 });
  };
  try {
    const result = await analyzeBookmark({ url: 'https://youtu.be/ABCDEFGHIJK' }, [{ name: 'Technology' }], { useLLM: false });
    assert.equal(result.platform, 'youtube');
    assert.equal(result.title, 'React Hooks Explained');
    assert.equal(result.source, 'youtube-oembed');
    assert.equal(result.suggestedCategory, 'Technology');
    assert.deepEqual(result.extractedTags, []);
  } finally { reset(); }
});

test('YouTube Data API extracts permitted caption hashtags and title', async () => {
  process.env.YOUTUBE_API_KEY = 'testing-key';
  globalThis.fetch = async (url) => {
    assert.equal(new URL(url).hostname, 'www.googleapis.com');
    return new Response(JSON.stringify({ items: [{ snippet: { title: 'Delicious pasta', description: 'A #pasta #recipe for dinner', tags: ['cooking'] } }] }), { status: 200 });
  };
  try {
    const result = await analyzeBookmark({ url: 'https://www.youtube.com/watch?v=ABCDEFGHIJK' }, [{ name: 'Food' }], { useLLM: false });
    assert.equal(result.status, 'available');
    assert.equal(result.suggestedCategory, 'Food');
    assert.ok(result.extractedTags.includes('pasta'));
    assert.ok(result.extractedTags.includes('cooking'));
  } finally { reset(); }
});

test('Instagram public oEmbed HTML never treated as caption or post title', async () => {
  globalThis.fetch = async (url) => {
    assert.equal(new URL(url).hostname, 'graph.facebook.com');
    return new Response(JSON.stringify({ html: '<blockquote>Secret caption #food</blockquote>', provider_name: 'Instagram' }), { status: 200 });
  };
  try {
    const result = await analyzeBookmark({ url: 'https://www.instagram.com/reel/ABC123/' }, [{ name: 'Food' }], { useLLM: false });
    assert.equal(result.status, 'limited');
    assert.equal(result.title, '');
    assert.equal(result.suggestedCategory, 'Uncategorised');
    assert.deepEqual(result.extractedTags, []);
  } finally { reset(); }
});

test('LinkedIn without authorised metadata returns limited manual fallback and makes no fetch', async () => {
  globalThis.fetch = () => { throw new Error('No network call should occur'); };
  try {
    const result = await getPermittedMetadata('https://www.linkedin.com/posts/example_activity_123');
    assert.equal(result.status, 'limited');
    assert.equal(result.title, '');
  } finally { reset(); }
});

test('Pinterest API with permitted token extracts title and hashtags', async () => {
  process.env.PINTEREST_ACCESS_TOKEN = 'TEST_TOKEN';
  globalThis.fetch = async (url, options) => {
    assert.equal(new URL(url).hostname, 'api.pinterest.com');
    assert.equal(options.headers.Authorization, 'Bearer TEST_TOKEN');
    return new Response(JSON.stringify({ title: 'Minimalist UI Inspiration', description: 'New #design #ux references' }), { status: 200 });
  };
  try {
    const result = await analyzeBookmark({ url: 'https://www.pinterest.com/pin/1234567/' }, [{ name: 'Design' }], { useLLM: false });
    assert.equal(result.status, 'available');
    assert.equal(result.suggestedCategory, 'Design');
    assert.deepEqual(result.extractedTags, ['design','ux']);
  } finally { reset(); }
});

test('Website article via third-party metadata API is categorised', async () => {
  delete process.env.METADATA_PROVIDER;
  globalThis.fetch = async (url) => {
    assert.equal(new URL(url).hostname, 'api.microlink.io');
    return new Response(JSON.stringify({ status: 'success', data: { title: 'React documentation', description: 'Learn javascript hooks.' } }), { status: 200 });
  };
  try {
    const result = await analyzeBookmark({ url: 'https://react.dev/reference/react/hooks' }, [{ name: 'Technology' }], { useLLM: false });
    assert.equal(result.source, 'microlink');
    assert.equal(result.suggestedCategory, 'Technology');
  } finally { reset(); }
});

test('Provider unavailable returns manual fallback and no invented category', async () => {
  globalThis.fetch = async () => { throw new Error('Provider unavailable'); };
  try {
    const result = await analyzeBookmark({ url: 'https://www.facebook.com/somepublicpost' }, [{ name: 'Food' }], { useLLM: false });
    assert.equal(result.status, 'limited');
    assert.equal(result.suggestedCategory, 'Uncategorised');
  } finally { reset(); }
});

test('User-provided social caption enables classification when platform access is limited', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ html: '<blockquote>Unavailable post</blockquote>' }), { status: 200 });
  try {
    const result = await analyzeBookmark({ url: 'https://www.instagram.com/reel/ABC123/', description: 'Easy homemade pasta recipe #food' }, [{ name: 'Food' }], { useLLM: false });
    assert.equal(result.status, 'limited');
    assert.equal(result.suggestedCategory, 'Food');
    assert.equal(result.title, '');
  } finally { reset(); }
});
