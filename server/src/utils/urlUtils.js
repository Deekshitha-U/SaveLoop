import { httpError } from './httpError.js';
const TRACKING_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];
export function normalizeUrl(input) {
  if (typeof input !== 'string' || !input.trim()) throw httpError(400, 'Enter a valid URL');
  let parsed;
  try { parsed = new URL(input.trim()); } catch { throw httpError(400, 'Invalid URL format'); }
  if (!['https:', 'http:'].includes(parsed.protocol)) throw httpError(400, 'Only HTTP/HTTPS links are allowed');
  if (parsed.username || parsed.password) throw httpError(400, 'URLs with embedded credentials are not accepted');
  const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '');
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local') || hostname.endsWith('.internal') ||
      hostname === '0.0.0.0' || hostname === '::1' || hostname.startsWith('127.') || hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') || hostname.startsWith('169.254.') || hostname.startsWith('172.16.') ||
      hostname.startsWith('172.17.') || hostname.startsWith('172.18.') || hostname.startsWith('172.19.') ||
      hostname.startsWith('172.2') || hostname.startsWith('172.30.') || hostname.startsWith('172.31.')) {
    throw httpError(400, 'Local or private-network URLs are not allowed');
  }
  if (!hostname.includes('.') || /\s/.test(hostname)) throw httpError(400, 'Enter a public website URL');
  parsed.hostname = hostname;
  parsed.hash = '';
  for (const param of TRACKING_PARAMS) parsed.searchParams.delete(param);
  if (parsed.pathname === '/') parsed.pathname = '/';
  return parsed.toString();
}
