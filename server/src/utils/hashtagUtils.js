export function parseTags(input) {
  const values = Array.isArray(input) ? input : String(input || '').split(/[\s,]+/);
  return [...new Set(values.map((value) => String(value).replace(/^#+/, '').trim().toLowerCase())
    .filter((value) => /^[a-z0-9][a-z0-9_\-]{0,29}$/.test(value)))].slice(0, 15);
}
