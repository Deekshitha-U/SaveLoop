const STOP_WORDS = new Set(['show','find','me','my','saved','save','links','link','resources','resource','from','for','about','the','a','an','and','in','on','of','with','that','i','want','need','get','please','video','videos','posts','post','all','some','which','what','did','do','have','give','last','this','week','month','yesterday','today','youtube','instagram','pinterest','linkedin','facebook','pending','completed','archived','high','low','priority','to','are','where']);
export function extractFilters(question) {
  const lower = question.toLowerCase();
  const platform = ['youtube', 'instagram', 'pinterest', 'linkedin', 'facebook', 'twitter', 'tiktok', 'github', 'medium'].find((p) => new RegExp(`\\b${p}\\b`).test(lower));
  const priority = /high[- ]priority/.test(lower) ? 'high' : /low[- ]priority/.test(lower) ? 'low' : null;
  const status = ['pending', 'completed', 'archived'].find((s) => new RegExp(`\\b${s}\\b`).test(lower)) ||
    (/haven.t (watched|read|finished)|not (watched|read|completed)/.test(lower) ? 'pending' : null);
  let from;
  let to;
  const now = new Date();
  if (/\byesterday\b/.test(lower)) {
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    from = yesterday.toISOString().slice(0, 10); to = from;
  } else if (/\btoday\b/.test(lower)) {
    from = now.toISOString().slice(0, 10);
  } else if (/\blast week\b/.test(lower)) {
    const week = new Date(now); week.setDate(now.getDate() - 7); from = week.toISOString().slice(0, 10);
  } else if (/\blast month\b/.test(lower)) {
    const month = new Date(now); month.setMonth(now.getMonth() - 1); from = month.toISOString().slice(0, 10);
  }
  const keywords = [...new Set((lower.match(/[a-z0-9-]{3,}/g) || []).filter((token) => !STOP_WORDS.has(token)))];
  return { platform, status, priority, from, to, keywords };
}
