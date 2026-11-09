import 'dotenv/config';
import './models/Post.js';
import { connectDb, disconnectDb } from './db.js';
import { createApp } from './app.js';

const port = Number(process.env.PORT) || 4000;
const adminKey = process.env.ADMIN_API_KEY;
if (!adminKey || adminKey.startsWith('change-me')) {
  console.warn('WARNING: ADMIN_API_KEY is not set (or still the placeholder). Set a real secret in .env.');
}

try {
  await connectDb();
} catch (err) {
  console.error(`Could not connect to MongoDB (${err.message}). Check MONGODB_URI, or run "docker compose up -d".`);
  process.exit(1);
}

const app = createApp({ adminKey, corsOrigin: process.env.CORS_ORIGIN });
const server = app.listen(port, () => console.log(`Blog API running on http://localhost:${port}/api`));

const shutdown = () => server.close(async () => { await disconnectDb(); process.exit(0); });
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
