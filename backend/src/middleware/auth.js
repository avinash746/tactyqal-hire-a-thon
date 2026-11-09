import crypto from 'node:crypto';
import { HttpError } from '../lib/errors.js';

function keyMatches(provided, expected) {
  if (!provided || !expected) return false;
  const a = crypto.createHash('sha256').update(provided).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

function extractKey(req) {
  const header = req.get('authorization');
  if (header?.toLowerCase().startsWith('bearer ')) return header.slice(7).trim();
  return req.get('x-api-key');
}

/** Marks req.isAdmin without rejecting. Used on public read routes. */
export const optionalAdmin = (adminKey) => (req, _res, next) => {
  req.isAdmin = keyMatches(extractKey(req), adminKey);
  next();
};

/** Rejects unless a valid admin key is supplied. Used on every write route. */
export const requireAdmin = (adminKey) => (req, _res, next) => {
  if (!adminKey) return next(new HttpError(503, 'ADMIN_API_KEY is not configured on the server'));
  if (!keyMatches(extractKey(req), adminKey)) {
    return next(new HttpError(401, 'Missing or invalid API key. Send it as "Authorization: Bearer <key>".'));
  }
  req.isAdmin = true;
  next();
};
