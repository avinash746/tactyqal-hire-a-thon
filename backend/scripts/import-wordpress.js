/**
 * Migrates posts from the existing WordPress blog through its public REST API.
 *   npm run import:wp -- https://tactyqal.com/blog
 * Re-running is safe: posts whose slug already exists are skipped.
 */
import 'dotenv/config';
import Post from '../src/models/Post.js';
import { connectDb, disconnectDb } from '../src/db.js';
import { createPostsRepo } from '../src/postsRepo.js';

const base = (process.argv[2] || 'https://tactyqal.com/blog').replace(/\/$/, '');
const decode = (s) =>
  s.replace(/&#8217;|&rsquo;/g, "'").replace(/&#8220;|&#8221;|&quot;/g, '"').replace(/&amp;/g, '&')
   .replace(/&#8211;|&ndash;/g, '-').replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n));

// Small HTML -> Markdown conversion that covers typical WordPress output.
function htmlToMarkdown(html) {
  return decode(
    html
      .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, l, t) => `\n\n${'#'.repeat(Math.max(2, +l))} ${t.replace(/<[^>]+>/g, '')}\n\n`)
      .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
      .replace(/<img [^>]*src="([^"]+)"[^>]*>/gi, '\n\n![]($1)\n\n')
      .replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, '**$2**')
      .replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, '*$2*')
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
      .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, t) => `\n\n> ${t.replace(/<[^>]+>/g, '').trim()}\n\n`)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
  ).replace(/\n{3,}/g, '\n\n').trim();
}

await connectDb();
const repo = createPostsRepo();
let page = 1, imported = 0, skipped = 0;

for (;;) {
  const res = await fetch(`${base}/wp-json/wp/v2/posts?per_page=50&page=${page}&_embed=1`);
  if (res.status === 400) break; // WordPress answers 400 past the last page
  if (!res.ok) throw new Error(`WordPress API returned ${res.status} for ${res.url}`);
  const items = await res.json();
  if (!items.length) break;

  for (const wp of items) {
    if (await Post.exists({ slug: wp.slug })) { skipped++; continue; }
    const terms = (wp._embedded?.['wp:term'] ?? []).flat().map((t) => t.name);
    await repo.create({
      title: decode(wp.title.rendered),
      slug: wp.slug,
      content: htmlToMarkdown(wp.content.rendered) || decode(wp.excerpt.rendered),
      excerpt: htmlToMarkdown(wp.excerpt.rendered).slice(0, 400),
      coverImage: wp._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '',
      author: wp._embedded?.author?.[0]?.name ?? 'Tactyqal',
      status: wp.status === 'publish' ? 'published' : 'draft',
      publishedAt: wp.date_gmt ? `${wp.date_gmt}Z` : undefined,
      tags: terms.slice(0, 10)
    });
    imported++;
  }
  page++;
}
console.log(`Imported ${imported} post(s), skipped ${skipped} existing.`);
await disconnectDb();
