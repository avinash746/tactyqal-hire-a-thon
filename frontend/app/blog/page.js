import Link from 'next/link';
import { getPosts, getTags } from '@/lib/api';
import PostCard from '@/components/PostCard';

export const metadata = { title: 'Blog', description: 'Practical articles on startup ideas, teams and launching.' };
export const dynamic = 'force-dynamic';

const href = (params) => {
  const sp = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
  const qs = sp.toString();
  return qs ? `/blog?${qs}` : '/blog';
};

export default async function BlogIndex({ searchParams }) {
  const q = searchParams.q || '';
  const tag = searchParams.tag || '';
  const page = Math.max(1, Number(searchParams.page) || 1);

  let result = null, tags = [], failed = false;
  try {
    [result, tags] = await Promise.all([getPosts({ page, limit: 9, q, tag }), getTags()]);
  } catch {
    failed = true;
  }

  return (
    <div className="container-x py-14 md:py-20">
      <h1 className="text-4xl font-extrabold md:text-6xl">Blog</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">Practical reads on startup ideas, building teams and launching.</p>

      <form action="/blog" className="mt-8 flex max-w-md gap-2" role="search">
        <label htmlFor="q" className="sr-only">Search articles</label>
        <input id="q" name="q" defaultValue={q} placeholder="Search articles" className="w-full rounded-full border-2 border-ink/15 bg-white px-5 py-2.5 outline-none focus:border-signal" />
        {tag && <input type="hidden" name="tag" value={tag} />}
        <button className="btn-primary !py-2.5">Search</button>
      </form>

      {tags.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Filter by topic">
          <li><Link href={href({ q })} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${!tag ? 'bg-ink text-white' : 'bg-white ring-1 ring-ink/10 hover:bg-chalk-deep'}`}>All</Link></li>
          {tags.map((t) => (
            <li key={t.slug}>
              <Link href={href({ q, tag: t.slug })} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tag === t.slug ? 'bg-ink text-white' : 'bg-white ring-1 ring-ink/10 hover:bg-chalk-deep'}`}>{t.name} ({t.count})</Link>
            </li>
          ))}
        </ul>
      )}

      {failed ? (
        <div className="mt-12 rounded-2xl bg-marigold-tint p-6" role="alert">
          <p className="font-bold">The blog API isn't reachable.</p>
          <p className="mt-1 text-ink-soft">Start the backend with <code>npm run dev</code> in the <code>backend</code> folder, then reload. Check that <code>API_URL</code> points to it.</p>
        </div>
      ) : result.data.length === 0 ? (
        <p className="mt-12 text-lg text-ink-soft">No articles match that search. <Link className="font-semibold text-signal underline" href="/blog">Clear filters</Link></p>
      ) : (
        <>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.data.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
          {result.meta.totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-4">
              {page > 1 && <Link className="btn-ghost !py-2" href={href({ q, tag, page: page - 1 })}>Previous</Link>}
              <span className="text-sm text-ink-mute">Page {page} of {result.meta.totalPages}</span>
              {page < result.meta.totalPages && <Link className="btn-ghost !py-2" href={href({ q, tag, page: page + 1 })}>Next</Link>}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
