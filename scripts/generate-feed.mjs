// Generates public/feed.xml (RSS 2.0) from content/blog.
// Runs automatically before `next build` (npm prebuild hook) and via `npm run feed`.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.yingqiu.me';
const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');
const OUT_FILE = path.join(process.cwd(), 'public', 'feed.xml');

// Mirrors src/lib/categories.ts (kept standalone so the script needs no TS build).
const CATEGORY_LABELS = {
  fuguang: { en: 'Moments', zh: '浮光' },
  jiujian: { en: 'Old Letters', zh: '旧笺' },
  liusheng: { en: 'Music', zh: '流声' },
  qiushu: { en: 'Quest', zh: '求索' },
  shiju: { en: 'Quotes', zh: '拾句' },
};

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

/** YAML parses `2026-08-14` as a Date; normalize to an ISO date string. */
const toDateString = (value) => {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === 'string' ? value : '';
};

const parseTags = (raw) => {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
};

const postUrl = (lang, slug) =>
  lang === 'zh' ? `${SITE_URL}/zh/posts/${slug}/` : `${SITE_URL}/posts/${slug}/`;

async function collectPosts() {
  const posts = [];
  for (const lang of ['en', 'zh']) {
    const dir = path.join(CONTENT_DIR, lang);
    let files = [];
    try {
      files = await fs.readdir(dir);
    } catch {
      continue; // language directory does not exist yet
    }
    for (const file of files.filter((f) => f.endsWith('.mdx'))) {
      const raw = await fs.readFile(path.join(dir, file), 'utf8');
      const { data } = matter(raw);
      if (data.draft === true) continue;
      const date = toDateString(data.date);
      if (typeof data.title !== 'string' || !date) continue;
      posts.push({
        title: data.title,
        description: typeof data.description === 'string' ? data.description : '',
        date,
        lang,
        slug: file.replace(/\.mdx$/, ''),
        category: typeof data.category === 'string' ? data.category : 'fuguang',
        tags: parseTags(data.tags),
      });
    }
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

const posts = await collectPosts();

const items = posts
  .map((post) => {
    const categoryLabel = CATEGORY_LABELS[post.category]?.[post.lang] ?? post.category;
    const tagLines = post.tags
      .map((tag) => `      <category>${escapeXml(tag)}</category>`)
      .join('\n');
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl(post.lang, post.slug)}</link>
      <guid isPermaLink="true">${postUrl(post.lang, post.slug)}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <language>${post.lang === 'zh' ? 'zh-CN' : 'en-GB'}</language>
      <category>${escapeXml(categoryLabel)}</category>
${tagLines}
    </item>`;
  })
  .join('\n');

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Qiushui Youxin · 秋水有信</title>
    <link>${SITE_URL}/</link>
    <description>Notes, letters and fragments by Yingqiu — life, old writings, music, reading, and the long road of learning.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
await fs.writeFile(OUT_FILE, feed, 'utf8');
console.log(`feed.xml written (${posts.length} posts)`);
