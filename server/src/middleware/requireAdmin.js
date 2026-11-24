import { httpError } from '../utils/httpError.js';
export function requireAdmin(req, res, next) {
  if (req.appUser?.role !== 'admin') return next(httpError(403, 'Admin access required'));
  next();
}
