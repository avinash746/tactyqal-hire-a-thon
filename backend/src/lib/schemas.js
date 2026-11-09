import { z } from 'zod';

const url = z.union([z.literal(''), z.string().url().max(500)]);

const base = {
  title: z.string().trim().min(3).max(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase letters, numbers and hyphens only')
    .optional(),
  excerpt: z.string().trim().max(400).optional(),
  content: z.string().min(1).max(200_000),
  coverImage: url.optional(),
  author: z.string().trim().min(1).max(80).optional(),
  status: z.enum(['draft', 'published']).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).optional()
};

export const postCreateSchema = z.object(base).strict();
export const postReplaceSchema = postCreateSchema; // PUT = full document
export const postPatchSchema = z
  .object(base)
  .partial()
  .strict()
  .refine((v) => Object.keys(v).length > 0, { message: 'Send at least one field to update' });

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  q: z.string().trim().max(100).optional(),
  tag: z.string().trim().max(40).optional(),
  status: z.enum(['draft', 'published', 'all']).optional()
});
