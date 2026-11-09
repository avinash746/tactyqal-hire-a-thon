// Server-side helpers that talk to the blog backend (../backend).
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function request(path) {
  const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export const getPosts = ({ page = 1, limit = 9, q, tag } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (q) params.set('q', q);
  if (tag) params.set('tag', tag);
  return request(`/posts?${params}`);
};
export const getPost = async (slug) => (await request(`/posts/${encodeURIComponent(slug)}`))?.data ?? null;
export const getTags = async () => (await request('/tags'))?.data ?? [];

/** Used by the homepage so it still renders if the API is offline. */
export async function getLatestPostsSafe(limit = 3) {
  try {
    const json = await getPosts({ limit });
    if (json?.data?.length) return { posts: json.data, live: true };
  } catch {}
  return { posts: FALLBACK, live: false };
}

const WP = 'https://tactyqal.com/blog/';
const FALLBACK = [
  { id: 'f1', title: 'The elevator pitch for business entrepreneurs', excerpt: 'An elevator pitch is the fastest way to describe what your startup does...', readTime: 3, publishedAt: '2024-05-01', externalUrl: WP + 'elevator-pitch-with-examples-for-business-entrepreneurs/', tags: ['Pitching'] },
  { id: 'f2', title: 'How to build a tech startup team?', excerpt: 'In the early days, the fewer employees, the better. Managing people takes up a lot of time...', readTime: 4, publishedAt: '2024-04-20', externalUrl: WP + 'how-to-build-a-tech-startup-team-2/', tags: ['Teams'] },
  { id: 'f3', title: '11 reasons why startups fail at the idea stage', excerpt: 'The default state of a startup is failure and there are many reasons why...', readTime: 3, publishedAt: '2024-04-10', externalUrl: WP + '11-reasons-why-startups-fail-at-idea-stage/', tags: ['Validation'] }
];
