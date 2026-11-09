import { ZodError } from 'zod';
import { HttpError } from '../lib/errors.js';

export const notFound = (_req, _res, next) => next(new HttpError(404, 'Route not found'));

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }))
    });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, ...(err.details && { details: err.details }) });
  }
  if (err.code === 11000) return res.status(409).json({ error: 'A post with that slug already exists' });
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid id' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Request body is not valid JSON' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request body too large' });
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
}
