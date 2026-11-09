import Link from 'next/link';
import { formatDate } from '@/lib/format';

export default function PostCard({ post }) {
  const external = Boolean(post.externalUrl);
  const href = external ? post.externalUrl : `/blog/${post.slug}`;
  const Tag = external ? 'a' : Link;
  const props = external ? { href, target: '_blank', rel: 'noreferrer' } : { href };
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10 transition-shadow hover:shadow-lg">
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImage} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
      ) : (
        <div aria-hidden className="aspect-[16/9] w-full bg-gradient-to-br from-signal-tint to-marigold-tint" />
      )}
      <div className="flex flex-1 flex-col p-5">
        {post.tags?.length > 0 && <p className="text-sm font-semibold text-signal">{post.tags.slice(0, 2).join(', ')}</p>}
        <h3 className="mt-1 text-xl font-bold leading-snug">
          <Tag {...props} className="after:absolute after:inset-0 hover:text-signal"><span className="relative">{post.title}</span></Tag>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 leading-7 text-ink-soft">{post.excerpt}</p>
        <p className="mt-4 text-sm text-ink-mute">{formatDate(post.publishedAt)} · {post.readTime} min read</p>
      </div>
    </article>
  );
}
