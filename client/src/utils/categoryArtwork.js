// Map the category name (not the source platform) to local artwork.
// These are illustrations, not media downloaded from Instagram/YouTube.
const artwork = {
  technology: 'technology', coding: 'technology', programming: 'technology',
  javascript: 'technology', react: 'technology', software: 'technology',
  education: 'education', learning: 'education', study: 'education',
  food: 'food', recipes: 'food', cooking: 'food',
  career: 'career', jobs: 'career', interview: 'career', work: 'career',
  design: 'design', inspiration: 'design', ui: 'design', ux: 'design',
  finance: 'finance', money: 'finance', business: 'finance',
  health: 'health', wellness: 'health', fitness: 'health',
  travel: 'travel', trips: 'travel', tourism: 'travel',
  entertainment: 'entertainment', movies: 'entertainment', music: 'entertainment',
  lifestyle: 'lifestyle', hobbies: 'lifestyle', productivity: 'lifestyle',
};

export function categoryArtwork(categoryName = '') {
  const words = String(categoryName).toLowerCase().split(/[^a-z]+/).filter(Boolean);
  const match = words.map((word) => artwork[word]).find(Boolean);
  return `/category-artwork/${match || 'other'}.svg`;
}
