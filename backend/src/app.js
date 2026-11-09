import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createPostsRepo } from './postsRepo.js';
import { postsRouter } from './routes/posts.js';
import { errorHandler, notFound } from './middleware/errors.js';

export function createApp({ adminKey, corsOrigin = 'http://localhost:3000' }) {
  const app = express();
  const repo = createPostsRepo();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: corsOrigin.split(',').map((o) => o.trim()),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use('/api', rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: true, legacyHeaders: false }));

  app.get('/api/health', (_req, res) =>
    res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({
      status: mongoose.connection.readyState === 1 ? 'ok' : 'database unavailable'
    })
  );
  app.use('/api', postsRouter({ repo, adminKey }));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
