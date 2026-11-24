import { httpError } from '../utils/httpError.js';
export const validateBody = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return next(httpError(400, result.error.issues.map((i) => i.message).join('; ')));
  req.validated = result.data;
  next();
};
