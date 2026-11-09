import Post from './models/Post.js';
import { slugify, readTimeMinutes, makeExcerpt } from './lib/text.js';

/**
 * Data-access layer. All database specific code lives here (plus models/Post.js).
 */
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const isObjectId = (v) => /^[a-f\d]{24}$/i.test(String(v));
const iso = (d) => (d ? new Date(d).toISOString() : null);

const toPost = (d, withContent) => {
  const post = {
    id: String(d._id),
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt,
    coverImage: d.coverImage,
    author: d.author,
    status: d.status,
    readTime: d.readTime,
    tags: (d.tags ?? []).map((t) => t.name).sort((a, b) => a.localeCompare(b)),
    publishedAt: iso(d.publishedAt),
    createdAt: iso(d.createdAt),
    updatedAt: iso(d.updatedAt)
  };
  if (withContent) post.content = d.content;
  return post;
};

const buildTags = (names) => {
  const seen = new Map();
  for (const raw of names) {
    const name = raw.trim();
    if (name && !seen.has(name.toLowerCase())) seen.set(name.toLowerCase(), { name, slug: slugify(name) });
  }
  return [...seen.values()];
};

const isDuplicateKey = (err) => err?.code === 11000;

/** Picks a free slug; the unique index is the final guard, so callers retry on E11000. */
async function freeSlug(wanted, ownId = null) {
  let slug = wanted;
  for (let n = 2; await Post.exists({ slug, ...(ownId && { _id: { $ne: ownId } }) }); n++) slug = `${wanted}-${n}`;
  return slug;
}

async function withSlugRetry(fn) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (!isDuplicateKey(err) || attempt >= 4) throw err;
    }
  }
}

export function createPostsRepo() {
  return {
    async list({ page, limit, q, tag, status = 'published' }) {
      const filter = {};
      if (status !== 'all') filter.status = status;
      if (q) {
        const rx = new RegExp(escapeRegex(q), 'i');
        filter.$or = [{ title: rx }, { excerpt: rx }, { content: rx }];
      }
      if (tag) filter['tags.slug'] = slugify(tag);

      const [total, docs] = await Promise.all([
        Post.countDocuments(filter),
        Post.find(filter)
          .select('-content')
          .sort({ publishedAt: -1, createdAt: -1, _id: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean()
      ]);
      return {
        data: docs.map((d) => toPost(d, false)),
        meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
      };
    },

    async get(idOrSlug, { includeDrafts = false } = {}) {
      const key = String(idOrSlug);
      const doc = await Post.findOne(isObjectId(key) ? { _id: key } : { slug: key }).lean();
      if (!doc || (!includeDrafts && doc.status !== 'published')) return null;
      return toPost(doc, true);
    },

    create(input) {
      return withSlugRetry(async () => {
        const status = input.status ?? 'draft';
        const doc = await Post.create({
          title: input.title,
          slug: await freeSlug(input.slug ?? slugify(input.title)),
          excerpt: input.excerpt || makeExcerpt(input.content),
          content: input.content,
          coverImage: input.coverImage ?? '',
          author: input.author ?? 'Tactyqal',
          status,
          readTime: readTimeMinutes(input.content),
          tags: buildTags(input.tags ?? []),
          publishedAt: status === 'published' ? input.publishedAt ?? new Date() : null
        });
        return toPost(doc.toObject(), true);
      });
    },

    async update(id, patch) {
      if (!isObjectId(id)) return null;
      return withSlugRetry(async () => {
        const doc = await Post.findById(id);
        if (!doc) return null;

        if (patch.title !== undefined) doc.title = patch.title;
        if (patch.content !== undefined) {
          doc.content = patch.content;
          doc.readTime = readTimeMinutes(patch.content);
        }
        if (patch.excerpt !== undefined) doc.excerpt = patch.excerpt || makeExcerpt(doc.content);
        else if (patch.content !== undefined) doc.excerpt = makeExcerpt(doc.content);
        if (patch.coverImage !== undefined) doc.coverImage = patch.coverImage;
        if (patch.author !== undefined) doc.author = patch.author;
        if (patch.slug && patch.slug !== doc.slug) doc.slug = await freeSlug(patch.slug, doc._id);
        if (patch.tags !== undefined) doc.tags = buildTags(patch.tags);
        if (patch.status !== undefined) {
          doc.status = patch.status;
          if (patch.status === 'published' && !doc.publishedAt) doc.publishedAt = new Date(); // first publish only
        }
        await doc.save();
        return toPost(doc.toObject(), true);
      });
    },

    async remove(id) {
      if (!isObjectId(id)) return false;
      return Boolean(await Post.findByIdAndDelete(id));
    },

    async listTags() {
      const rows = await Post.aggregate([
        { $match: { status: 'published' } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags.slug', name: { $first: '$tags.name' }, count: { $sum: 1 } } },
        { $sort: { count: -1, name: 1 } }
      ]);
      return rows.map((r) => ({ name: r.name, slug: r._id, count: r.count }));
    }
  };
}
