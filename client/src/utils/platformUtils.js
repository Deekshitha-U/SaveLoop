export const platformNames = { youtube: 'YouTube', instagram: 'Instagram', pinterest: 'Pinterest', linkedin: 'LinkedIn', facebook: 'Facebook',
  twitter: 'X / Twitter', github: 'GitHub', tiktok: 'TikTok', medium: 'Medium', website: 'Website' };
export const platformName = (id) => platformNames[id] || 'Website';
export function isSafeExternalUrl(url) { try { return ['https:', 'http:'].includes(new URL(url).protocol); } catch { return false; } }
