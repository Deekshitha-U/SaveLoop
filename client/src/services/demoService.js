// Frontend-only preview: never sends requests to a backend or grants admin access.
// These records are fictional. They live in your browser's localStorage.
const prefix = 'saveloop_demo_';
const id = () => (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
const read = (key, fallback) => { try { const value = localStorage.getItem(prefix + key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
const write = (key, value) => { localStorage.setItem(prefix + key, JSON.stringify(value)); return value; };
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();
const seedCategories = [
  { _id: 'c_tech', name: 'Technology', count: 0, isDefault: true }, { _id: 'c_education', name: 'Education', count: 0, isDefault: true },
  { _id: 'c_career', name: 'Career', count: 0, isDefault: true }, { _id: 'c_food', name: 'Food', count: 0, isDefault: true },
  { _id: 'c_design', name: 'Design', count: 0, isDefault: true }, { _id: 'c_life', name: 'Lifestyle', count: 0, isDefault: true },
  { _id: 'c_travel', name: 'Travel', count: 0, isDefault: true }, { _id: 'c_other', name: 'Other', count: 0, isDefault: true },
];
const raw = [
  ['The Science of Building Better Habits', 'https://jamesclear.com/habits', 'website', 'Lifestyle', 'c_life', ['habits','productivity','self-improvement'], 'A practical guide on building positive daily routines.', 'completed', 1],
  ['Understanding React Hooks', 'https://react.dev/reference/react/hooks', 'website', 'Technology', 'c_tech', ['react','javascript','hooks'], 'Study useEffect, useMemo, and useState for interviews.', 'pending', 2],
  ['The Future of Work and AI', 'https://www.linkedin.com/feed/', 'linkedin', 'Career', 'c_career', ['ai','career','future-of-work'], 'Ideas for skills to build as a developer.', 'completed', 4],
  ['Node.js Learn Guide', 'https://nodejs.org/en/learn', 'website', 'Technology', 'c_tech', ['node','backend','javascript'], 'Backend patterns and event loop basics.', 'pending', 6],
  ['Minimalist Workspace Inspiration', 'https://www.pinterest.com/ideas/home-office/', 'pinterest', 'Design', 'c_design', ['workspace','design','inspiration'], 'Orange and charcoal desk setups.', 'archived', 9],
  ['Classic Pasta Recipe', 'https://www.youtube.com/results?search_query=pasta+recipe', 'youtube', 'Food', 'c_food', ['pasta','recipe','cooking'], 'Try making pasta on the weekend.', 'pending', 12],
  ['JavaScript Async Programming', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS', 'website', 'Education', 'c_education', ['promises','async','javascript'], 'Promises, callbacks, async-await notes.', 'completed', 15],
  ['Productive Travel Packing Tips', 'https://www.wikivoyage.org/', 'website', 'Travel', 'c_travel', ['travel','tips'], 'Checklist for weekend travel.', 'pending', 19],
];
const seedBookmarks = raw.map((x, i) => ({ _id: `demo_${i + 1}`, id: `demo_${i + 1}`, title: x[0], url: x[1], canonicalUrl: x[1], platform: x[2],
  categoryName: x[3], categoryId: x[4], tags: x[5], notes: x[6], status: x[7], priority: i % 3 === 1 ? 'high' : 'normal', savedAt: daysAgo(x[8]), createdAt: daysAgo(x[8]) }));
function books() { return read('bookmarks', seedBookmarks); }
function cats() { return read('categories', seedCategories); }
function rems() { return read('reminders', [
  { _id: 'r_demo', bookmarkId: seedBookmarks[1], remindAt: new Date(Date.now() + 86400000).toISOString(), completed: false },
]); }
export const demoSession = {
  get: () => read('session', null),
  login: (role = 'user') => { const user = { _id: `demo-${role}`, firebaseUid: `demo-${role}`, name: role === 'admin' ? 'Demo Admin' : 'Alex Morgan', email: `${role}@saveloop.demo`, role,
    status: 'active', preferences: { theme: 'dark' }, createdAt: daysAgo(12) }; return write('session', user); },
  logout: () => { localStorage.removeItem(prefix + 'session'); },
  update: (values) => { const user = { ...demoSession.get(), ...values }; return write('session', user); },
};
const delay = () => new Promise((resolve) => setTimeout(resolve, 100));
export const demo = {
  async listBookmarks(params = {}) {
    await delay(); let data = books();
    if (params.q) { const q = params.q.toLowerCase(); data = data.filter((b) => [b.title, b.notes, b.categoryName, b.platform, ...b.tags].join(' ').toLowerCase().includes(q)); }
    if (params.platform && params.platform !== 'all') data = data.filter((b) => b.platform === params.platform);
    if (params.status && params.status !== 'all') data = data.filter((b) => b.status === params.status);
    if (params.priority && params.priority !== 'all') data = data.filter((b) => b.priority === params.priority);
    if (params.categoryId) data = data.filter((b) => b.categoryId === params.categoryId);
    if (params.from) data = data.filter((b) => b.savedAt.slice(0, 10) >= params.from);
    if (params.to) data = data.filter((b) => b.savedAt.slice(0, 10) <= params.to);
    return data.sort((a, b) => params.sort === 'oldest' ? new Date(a.savedAt) - new Date(b.savedAt) : params.sort === 'title' ? a.title.localeCompare(b.title) : new Date(b.savedAt) - new Date(a.savedAt));
  },
  async getBookmark(bookmarkId) { return books().find((b) => b._id === bookmarkId) || null; },
  async createBookmark(body) {
    const existing = books().find((b) => b.url === body.url);
    if (existing) throw new Error('You already saved this URL');
    const category = cats().find((c) => c._id === body.categoryId);
    const doc = { ...body, _id: id(), id: id(), platform: demo.detect(body.url), categoryName: category?.name || 'Uncategorised',
      tags: demo.tags(body.tags), savedAt: new Date().toISOString(), status: body.status || 'pending', priority: body.priority || 'normal' };
    write('bookmarks', [doc, ...books()]); return doc;
  },
  async updateBookmark(bookmarkId, changes) {
    const category = cats().find((c) => c._id === changes.categoryId);
    const items = books().map((b) => b._id !== bookmarkId ? b : { ...b, ...changes, ...(changes.url ? { platform: demo.detect(changes.url) } : {}),
      ...(changes.categoryId !== undefined ? { categoryName: category?.name || 'Uncategorised' } : {}),
      ...(changes.tags !== undefined ? { tags: demo.tags(changes.tags) } : {}) });
    write('bookmarks', items); return items.find((b) => b._id === bookmarkId);
  },
  async deleteBookmark(bookmarkId) { write('bookmarks', books().filter((b) => b._id !== bookmarkId)); write('reminders', rems().filter((r) => (r.bookmarkId?._id || r.bookmarkId) !== bookmarkId)); },
  async listCategories() { return cats().map((cat) => ({ ...cat, count: books().filter((b) => b.categoryId === cat._id).length })); },
  async createCategory(body) { if (cats().some((c) => c.name.toLowerCase() === body.name.toLowerCase())) throw new Error('Category already exists'); const cat = { ...body, _id: id(), isDefault: false }; write('categories', [...cats(), cat]); return cat; },
  async updateCategory(categoryId, changes) { const categories = cats().map((c) => c._id === categoryId ? { ...c, ...changes } : c); write('categories', categories); if (changes.name) write('bookmarks', books().map((b) => b.categoryId === categoryId ? { ...b, categoryName: changes.name } : b)); return categories.find((c) => c._id === categoryId); },
  async deleteCategory(categoryId) { write('categories', cats().filter((c) => c._id !== categoryId)); write('bookmarks', books().map((b) => b.categoryId === categoryId ? { ...b, categoryId: null, categoryName: 'Uncategorised' } : b)); },
  async listReminders() { return rems().map((r) => ({ ...r, bookmarkId: books().find((b) => b._id === (r.bookmarkId?._id || r.bookmarkId)) || null })); },
  async createReminder(body) { const bookmark = books().find((b) => b._id === body.bookmarkId); if (!bookmark) throw new Error('Bookmark not found'); const r = { _id: id(), bookmarkId: bookmark, remindAt: body.remindAt, completed: false }; write('reminders', [...rems(), r]); return r; },
  async updateReminder(reminderId, changes) { const data = rems().map((r) => r._id === reminderId ? { ...r, ...changes } : r); write('reminders', data); return data.find((r) => r._id === reminderId); },
  async deleteReminder(reminderId) { write('reminders', rems().filter((r) => r._id !== reminderId)); },
  detect(url) { try { const h = new URL(url).hostname; return ['youtube','instagram','pinterest','linkedin','facebook','github','twitter','tiktok','medium'].find((p) => h.includes(p)) || 'website'; } catch { return 'website'; } },
  tags(input) { return [...new Set((Array.isArray(input) ? input : String(input || '').split(/[\s,]+/)).map((s) => String(s).replace(/^#+/, '').toLowerCase().trim()).filter(Boolean))].slice(0,15); },
  async categorize(body) {
    const words = [body.title, body.notes, body.tags].filter(Boolean).join(' ').toLowerCase();
    const hints = [['Technology', /react|node|javascript|mongo|coding|programming|backend/], ['Food', /food|recipe|cook|pasta/], ['Career', /job|interview|resume/], ['Design', /design|ui|figma/], ['Education', /tutorial|learn|study/], ['Travel', /travel|trip/]];
    const matches = hints.filter(([, expression]) => expression.test(words)).slice(0, 3).map(([name]) => ({ name, confidence: 'medium' }));
    return {
      platform: demo.detect(body.url), status: 'limited', source: 'demo', title: '', description: '',
      extractedTags: [], suggestedTags: [], suggestions: matches.length ? matches : [{ name: 'Uncategorised', confidence: 'low' }],
      aiUsed: false, message: 'Demo mode does not contact third-party metadata APIs. Switch to real mode to analyse accessible public links.'
    };
  },
  async chat(question) {
    const words = question.toLowerCase().split(/\W+/).filter((w) => w.length >= 4 && !['find','show','saved','from','about','with','links','link','please','what','have','need','last','week'].includes(w));
    const platform = ['youtube','instagram','pinterest','linkedin','facebook'].find((p) => question.toLowerCase().includes(p));
    const status = ['pending','completed','archived'].find((s) => question.toLowerCase().includes(s));
    const matching = books().filter((b) => (!platform || b.platform === platform) && (!status || b.status === status) && (!words.length || words.some((w) => [b.title,b.notes,b.categoryName,...b.tags].join(' ').toLowerCase().includes(w)))).slice(0,5);
    return { answer: matching.length ? `I found ${matching.length} matching bookmark${matching.length > 1 ? 's' : ''} in your demo library. Click a result to open the original.` : 'No exact matches in your demo library. Try React, recipes, or Node.js.', bookmarks: matching.map((b) => ({ ...b, id: b._id })) };
  },
  async stats() { const b = books(); return { totalUsers: 14, activeUsers: 12, totalBookmarks: b.length + 72, newUsersLast30Days: 6, platformCounts: [{ _id: 'website', count: 39 }, { _id: 'youtube', count: 21 }, { _id: 'pinterest', count: 12 }] }; },
  async listUsers(query = '') { const people = [
    { _id: 'u1', name: 'Alex Morgan', email: 'alex@example.com', role: 'user', status: 'active', bookmarkCount: books().length, createdAt: daysAgo(10), lastSeenAt: daysAgo(0) },
    { _id: 'u2', name: 'Jordan Lee', email: 'jordan@example.com', role: 'user', status: 'active', bookmarkCount: 15, createdAt: daysAgo(18), lastSeenAt: daysAgo(1) },
    { _id: 'u3', name: 'Taylor Kim', email: 'taylor@example.com', role: 'user', status: 'disabled', bookmarkCount: 8, createdAt: daysAgo(26), lastSeenAt: daysAgo(7) },
    { _id: 'demo-admin', name: 'Demo Admin', email: 'admin@saveloop.demo', role: 'admin', status: 'active', bookmarkCount: 0, createdAt: daysAgo(30) },
  ]; const existing = read('adminUsers', people); return existing.filter((u) => [u.name,u.email].join(' ').toLowerCase().includes(query.toLowerCase())); },
  async getUser(uid) { return (await demo.listUsers()).find((u) => u._id === uid) || null; },
  async updateUser(uid, changes) { const all = await demo.listUsers(); const users = all.map((u) => u._id === uid ? { ...u, ...changes } : u); write('adminUsers', users); return users.find((u) => u._id === uid); },
};
