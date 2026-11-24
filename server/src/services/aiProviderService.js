import { AI_CONFIG } from '../config/aiConfig.js';
async function openai(path, payload, timeoutMs = 12000) {
  if (!AI_CONFIG.enabled) return null;
  const response = await fetch(`https://api.openai.com/v1/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`AI provider returned HTTP ${response.status}`);
  return response.json();
}
export async function embedText(text) {
  if (!AI_CONFIG.enabled || !text.trim()) return null;
  const data = await openai('embeddings', { model: AI_CONFIG.embeddingModel, input: text.slice(0, 6000) });
  return data?.data?.[0]?.embedding || null;
}
export async function groundedSummary(question, bookmarks) {
  if (!AI_CONFIG.enabled || !bookmarks.length) return null;
  const context = bookmarks.map((b, i) => ({ number: i + 1, title: b.title, platform: b.platform,
    category: b.categoryName, priority: b.priority, tags: b.tags, notes: b.notes?.slice(0, 400), description: b.description?.slice(0, 400), status: b.status }));
  const data = await openai('chat/completions', {
    model: AI_CONFIG.chatModel,
    temperature: 0.1,
    max_tokens: 240,
    messages: [
      { role: 'system', content: 'You are SaveLoop assistant. Answer using ONLY the provided saved bookmark metadata. Do not make up titles, URLs, dates, or video contents. Keep the answer short. Actual clickable links are rendered separately by the app. If uncertain, be explicit.' },
      { role: 'user', content: `QUESTION: ${question}\nSAVED RECORDS: ${JSON.stringify(context)}` },
    ],
  });
  return data?.choices?.[0]?.message?.content || null;
}

// Suggests labels from available text ONLY. The model must never invent a post
// caption, video contents, or an existing category outside the user's library.
export async function suggestMetadataWithLLM({ title = '', description = '', notes = '', tags = [], available = [] }) {
  if (!AI_CONFIG.enabled) return null;
  const categoryNames = available.map((c) => (typeof c === 'string' ? c : c.name)).filter(Boolean).slice(0, 80);
  const data = await openai('chat/completions', {
    model: AI_CONFIG.chatModel,
    temperature: 0,
    max_tokens: 150,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'You classify saved links from ONLY the supplied permitted metadata/user text. Never infer unseen image or video contents. Return JSON exactly like {"category":"Technology","tags":["javascript"]}. Choose category ONLY from the supplied existing categories, or "Uncategorised" if unclear. Tags must be relevant to supplied text and are suggestions, not extracted hashtags. Max 8 short lowercase tags.' },
      { role: 'user', content: JSON.stringify({ existingCategories: categoryNames, title: title.slice(0, 200), description: description.slice(0, 1000), notes: notes.slice(0, 800), tags: tags.slice(0, 15) }) },
    ],
  }, 7000);
  try {
    const parsed = JSON.parse(data?.choices?.[0]?.message?.content || '{}');
    return { category: typeof parsed.category === 'string' ? parsed.category : 'Uncategorised', tags: Array.isArray(parsed.tags) ? parsed.tags : [] };
  } catch { return null; }
}
