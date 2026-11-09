import Link from 'next/link';
import { getLatestPostsSafe } from '@/lib/api';
import PostCard from './PostCard';
import SectionHeading from './SectionHeading';

export default async function BlogPreview() {
  const { posts } = await getLatestPostsSafe(3);
  return (
    <section id="blog" className="section">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading title="Learn from industry experts">Short, practical reads on ideas, teams and launching.</SectionHeading>
          <Link href="/blog" className="btn-ghost shrink-0">Read all articles</Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      </div>
    </section>
  );
}
