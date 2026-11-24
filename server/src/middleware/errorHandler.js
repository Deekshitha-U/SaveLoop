export function errorHandler(err, _req, res, _next) {
  const status = err.status || (err.code === 11000 ? 409 : err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500);
  const message = err.code === 11000 ? 'This item already exists in your library' : status === 500 ? 'Internal server error' : err.message;
  if (status === 500) console.error(err);
  res.status(status).json({ error: message });
}
