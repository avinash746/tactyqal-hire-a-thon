import { Router } from 'express';
import { HttpError } from '../lib/errors.js';
import {
  listQuerySchema,
  postCreateSchema,
  postPatchSchema,
  postReplaceSchema
} from '../lib/schemas.js';
import { optionalAdmin, requireAdmin } from '../middleware/auth.js';
import { isObjectId } from '../postsRepo.js';

const parseId = (raw) => {
  if (!isObjectId(raw)) throw new HttpError(400, 'Post id must be a 24 character MongoDB id');
  return raw;
};

export function postsRouter({ repo, adminKey }) {
  const router = Router();
  const admin = requireAdmin(adminKey);

  // Public: published posts only. Admins may pass ?status=draft|all.
  router.get('/posts', optionalAdmin(adminKey), async (req, res) => {
    const query = listQuerySchema.parse(req.query);
    const status = req.isAdmin ? query.status ?? 'published' : 'published';
    res.json(await repo.list({ ...query, status }));
  });

  // Public by slug or numeric id. Drafts are visible to admins only.
  router.get('/posts/:idOrSlug', optionalAdmin(adminKey), async (req, res) => {
    const post = await repo.get(req.params.idOrSlug, { includeDrafts: req.isAdmin });
    if (!post) throw new HttpError(404, 'Post not found');
    res.json({ data: post });
  });

  router.post('/posts', admin, async (req, res) => {
    const post = await repo.create(postCreateSchema.parse(req.body));
    res.status(201).location(`/api/posts/${post.slug}`).json({ data: post });
  });

  router.put('/posts/:id', admin, async (req, res) => {
    const post = await repo.update(parseId(req.params.id), postReplaceSchema.parse(req.body));
    if (!post) throw new HttpError(404, 'Post not found');
    res.json({ data: post });
  });

  router.patch('/posts/:id', admin, async (req, res) => {
    const post = await repo.update(parseId(req.params.id), postPatchSchema.parse(req.body));
    if (!post) throw new HttpError(404, 'Post not found');
    res.json({ data: post });
  });

  router.delete('/posts/:id', admin, async (req, res) => {
    if (!(await repo.remove(parseId(req.params.id)))) throw new HttpError(404, 'Post not found');
    res.status(204).end();
  });

  router.get('/tags', async (_req, res) => res.json({ data: await repo.listTags() }));

  return router;
}
