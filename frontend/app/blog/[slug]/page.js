import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getPost } from '@/lib/api';
import { formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

const safeGet = async (slug) => { try { return await getPost(slug); } catch { return undefined; } };

export async function generateMetadata({ params }) {
  const post = await safeGet(params.slug);
  return post ? { title: post.title, description: post.excerpt } : { title: 'Article' };
}

export default async function PostPage({ params }) {
  const post = await safeGet(params.slug);
  if (post === undefined) {
    return (
      <div className="container-x py-20" role="alert">
        <p className="font-bold">The blog API isn't reachable.</p>
        <Link href="/blog" className="mt-4 inline-block font-semibold text-signal underline">Back to blog</Link>
      </div>
    );
  }
  if (!post) notFound();

  return (
    <article className="container-x max-w-3xl py-14 md:py-20">
      <Link href="/blog" className="text-sm font-semibold text-signal hover:underline">Back to all articles</Link>
      <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">{post.title}</h1>
      <p className="mt-4 text-ink-mute">
        By {post.author} · {formatDate(post.publishedAt)} · {post.readTime} min read
      </p>
      {post.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((t) => <li key={t} className="rounded-full bg-signal-tint px-3 py-1 text-sm font-semibold text-signal-dark">{t}</li>)}
        </ul>
      )}
      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImage} alt="" className="mt-8 w-full rounded-2xl" />
      )}
      <div className="prose-post mt-8">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
