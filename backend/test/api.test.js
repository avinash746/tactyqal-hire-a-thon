import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import '../src/models/Post.js';
import { connectDb, disconnectDb } from '../src/db.js';
import { createApp } from '../src/app.js';

const KEY = 'test-key';
let server, base;
// Needs a running MongoDB. Each run uses its own throwaway database that is dropped afterwards.
const TEST_URI =
  process.env.MONGODB_TEST_URI || `mongodb://127.0.0.1:27017/tactyqal_test_${Date.now()}`;
const api = (path, { method = 'GET', body, key } = {}) =>
  fetch(`${base}/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(key && { Authorization: `Bearer ${key}` }) },
    body: body && JSON.stringify(body)
  });

before(async () => {
  await connectDb(TEST_URI);
  server = createApp({ adminKey: KEY }).listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server.close();
  await mongoose.connection.dropDatabase();
  await disconnectDb();
});

test('health check', async () => {
  const res = await api('/health');
  assert.equal(res.status, 200);
});

test('writes require the admin key', async () => {
  const res = await api('/posts', { method: 'POST', body: { title: 'No key', content: 'x' } });
  assert.equal(res.status, 401);
});

test('validation rejects bad input with field details', async () => {
  const res = await api('/posts', { method: 'POST', key: KEY, body: { title: 'ab', content: '' } });
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.ok(json.details.some((d) => d.field === 'title'));
});

test('full CRUD lifecycle', async () => {
  // create
  let res = await api('/posts', {
    method: 'POST', key: KEY,
    body: { title: 'Hello World', content: 'First **post** body', status: 'published', tags: ['Intro', 'News'] }
  });
  assert.equal(res.status, 201);
  const created = (await res.json()).data;
  assert.equal(created.slug, 'hello-world');
  assert.deepEqual(created.tags, ['Intro', 'News']);
  assert.ok(created.publishedAt);

  // read by slug and by id
  assert.equal((await (await api('/posts/hello-world')).json()).data.id, created.id);
  assert.equal((await (await api(`/posts/${created.id}`)).json()).data.title, 'Hello World');

  // duplicate titles get unique slugs
  res = await api('/posts', { method: 'POST', key: KEY, body: { title: 'Hello World', content: 'Again', status: 'published' } });
  assert.equal((await res.json()).data.slug, 'hello-world-2');

  // patch
  res = await api(`/posts/${created.id}`, { method: 'PATCH', key: KEY, body: { title: 'Hello Again', tags: ['News'] } });
  const patched = (await res.json()).data;
  assert.equal(patched.title, 'Hello Again');
  assert.deepEqual(patched.tags, ['News']);

  // list, search, tag filter
  let list = await (await api('/posts?q=again&limit=5')).json();
  assert.ok(list.meta.total >= 1);
  list = await (await api('/posts?tag=news')).json();
  assert.equal(list.data.length, 1);
  assert.equal((await (await api('/tags')).json()).data[0].name, 'News');

  // delete
  assert.equal((await api(`/posts/${created.id}`, { method: 'DELETE', key: KEY })).status, 204);
  assert.equal((await api(`/posts/${created.id}`)).status, 404);
});

test('drafts are hidden from the public but visible to admins', async () => {
  const res = await api('/posts', { method: 'POST', key: KEY, body: { title: 'Secret draft', content: 'wip' } });
  const draft = (await res.json()).data;
  assert.equal(draft.status, 'draft');
  assert.equal((await api(`/posts/${draft.slug}`)).status, 404);
  assert.equal((await api(`/posts/${draft.slug}`, { key: KEY })).status, 200);
  const publicList = await (await api('/posts?status=all')).json();
  assert.ok(!publicList.data.some((p) => p.slug === draft.slug));
  const adminList = await (await api('/posts?status=draft', { key: KEY })).json();
  assert.ok(adminList.data.some((p) => p.slug === draft.slug));
});

test('malformed and unknown ids are handled', async () => {
  assert.equal((await api('/posts/123', { method: 'PATCH', key: KEY, body: { title: 'Nope nope' } })).status, 400);
  assert.equal((await api('/posts/64b7f0c2a1b2c3d4e5f60718', { method: 'DELETE', key: KEY })).status, 404);
});

test('unknown routes return JSON 404', async () => {
  const res = await api('/nope');
  assert.equal(res.status, 404);
  assert.equal((await res.json()).error, 'Route not found');
});
