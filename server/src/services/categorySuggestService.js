const TOPICS = [
  { words: ['react', 'node', 'javascript', 'typescript', 'mongodb', 'express', 'coding', 'programming', 'backend', 'frontend', 'api'], category: 'Technology' },
  { words: ['interview', 'resume', 'job', 'career', 'internship', 'placement'], category: 'Career' },
  { words: ['food', 'recipe', 'pasta', 'baking', 'cook', 'cooking'], category: 'Food' },
  { words: ['design', 'ui', 'ux', 'figma', 'typography', 'inspiration'], category: 'Design' },
  { words: ['learn', 'course', 'tutorial', 'education', 'study'], category: 'Education' },
  { words: ['travel', 'destination', 'holiday', 'trip'], category: 'Travel' },
  { words: ['fitness', 'health', 'workout', 'wellness'], category: 'Health' },
  { words: ['budget', 'finance', 'invest', 'saving'], category: 'Finance' },
  { words: ['music', 'movie', 'film', 'gaming'], category: 'Entertainment' },
];
export function suggestCategories({ url = '', title = '', notes = '', tags = [], available = [] }) {
  const source = [title, notes, ...(Array.isArray(tags) ? tags : []), url].join(' ').toLowerCase();
  const suggestions = TOPICS.map((topic) => ({
    name: topic.category,
    matches: topic.words.filter((word) => new RegExp(`\\b${word}\\b`, 'i').test(source)).length,
  })).filter((x) => x.matches > 0).sort((a, b) => b.matches - a.matches).slice(0, 3)
    .map((x) => ({ name: x.name, confidence: x.matches > 1 ? 'high' : 'medium' }));
  const allowed = new Set(available.map((x) => (typeof x === 'string' ? x : x.name)));
  // If user has existing categories, matching names are preferred; never fabricate content claims.
  suggestions.sort((a, b) => Number(allowed.has(b.name)) - Number(allowed.has(a.name)));
  return suggestions.length ? suggestions : [{ name: 'Uncategorised', confidence: 'low' }];
}
