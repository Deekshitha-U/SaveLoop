import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUrl } from '../src/utils/urlUtils.js';
import { parseTags } from '../src/utils/hashtagUtils.js';
import { detectPlatform } from '../src/services/platformService.js';
import { suggestCategories } from '../src/services/categorySuggestService.js';
import { extractFilters } from '../src/services/queryParserService.js';
test('URL normalization strips tracking and fragment', () => assert.equal(normalizeUrl('https://youtube.com/watch?v=1&utm_source=test#abc'), 'https://youtube.com/watch?v=1'));
test('malicious protocol blocked', () => assert.throws(() => normalizeUrl('javascript:alert(1)')));
test('loopback URL blocked', () => assert.throws(() => normalizeUrl('http://127.0.0.1:5000/private')));
test('platform matches exact domain boundaries', () => { assert.equal(detectPlatform('https://m.youtube.com/watch?v=a'), 'youtube'); assert.equal(detectPlatform('https://notyoutube.com/a'), 'website'); });
test('hashtags normalized and deduplicated', () => assert.deepEqual(parseTags('#React #react javascript'), ['react','javascript']));
test('category from keywords', () => assert.equal(suggestCategories({ tags: ['#react','#javascript'] })[0].name, 'Technology'));
test('AI query parser', () => { const filters = extractFilters('Find pending YouTube videos about React'); assert.equal(filters.platform, 'youtube'); assert.equal(filters.status, 'pending'); assert.ok(filters.keywords.includes('react')); });

test('high-priority retrieval question', () => assert.equal(extractFilters('Find high-priority interview resources').priority, 'high'));
