import { getPermittedMetadata } from './metadataService.js';
import { suggestCategories } from './categorySuggestService.js';
import { suggestMetadataWithLLM } from './aiProviderService.js';
import { parseTags } from '../utils/hashtagUtils.js';

export async function analyzeBookmark({ url, title = '', description = '', notes = '', tags = [] }, available = [], { useLLM = true } = {}) {
  const metadata = await getPermittedMetadata(url);
  const suppliedTags = parseTags(tags);
  const sourceTags = parseTags(metadata.tags);
  const textTitle = title.trim() || metadata.title;
  const caption = [metadata.description, description].filter(Boolean).join(' ');
  const sourceText = [textTitle, caption, notes, ...sourceTags, ...suppliedTags].filter(Boolean).join(' ');
  const sufficientText = sourceText.replace(/https?:\/\/\S+/g, '').trim().length > 2;
  const rules = sufficientText ? suggestCategories({ title: textTitle, notes: [caption, notes].join(' '), tags: [...sourceTags, ...suppliedTags], available }) :
    [{ name: 'Uncategorised', confidence: 'low' }];
  let suggestions = rules;
  let suggestedTags = [];
  let aiUsed = false;
  // LLM reads permitted metadata and user text ONLY, never opaque video URLs.
  if (useLLM && sufficientText && process.env.OPENAI_API_KEY) {
    try {
      const result = await suggestMetadataWithLLM({ title: textTitle, description: caption, notes, tags: [...sourceTags, ...suppliedTags], available });
      if (result) {
        const allowed = new Set(available.map((c) => String(c.name || c).toLowerCase()));
        if (allowed.has(String(result.category || '').toLowerCase())) {
          suggestions = [{ name: available.find((c) => String(c.name || c).toLowerCase() === result.category.toLowerCase())?.name || result.category, confidence: 'medium' },
            ...rules.filter((s) => s.name.toLowerCase() !== result.category.toLowerCase())].slice(0, 3);
        }
        suggestedTags = parseTags(result.tags).slice(0, 8);
        aiUsed = true;
      }
    } catch (error) { console.warn('Category AI unavailable; using keyword rules:', error.message); }
  }
  return {
    ...metadata,
    extractedTags: sourceTags,
    suggestedTags,
    suggestions,
    aiUsed,
    // Avoid claiming an actual title or caption exists if only the URL is present.
    suggestedCategory: suggestions[0]?.name || 'Uncategorised',
  };
}
