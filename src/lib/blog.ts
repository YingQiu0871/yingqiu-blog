import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { isValidLocale, locales, type Locale } from '@/lib/i18n/config';
import { CATEGORIES, isCategoryId, type Category, type CategoryId } from '@/lib/categories';

export type MusicTrack = {
  title: string;
  artist?: string;
  url?: string;
  note?: string;
};

export type BlogPost = {
  slug: string;
  lang: Locale;
  title: string;
  description: string;
  /** ISO date of blog publication / re-editing, e.g. 2026-08-14. */
  date: string;
  updated?: string;
  /** One of the five stable categories; falls back to `fuguang` when missing. */
  category: CategoryId;
  /** For 旧笺 (jiujian): when the piece was originally written — `2019`, `2019-06` or `2019-06-15`. */
  originalDate?: string;
  /** For 旧笺: a short "rereading it years later" note shown before the body. */
  rereadNote?: string;
  /** For 拾句 (shiju): the quoted text itself. */
  quote?: string;
  quoteSource?: string;
  /** Optional cover image path, e.g. `/images/covers/summer-2026.jpg`. */
  cover?: string;
  /** For 流声 (liusheng): track list rendered as a glass panel. */
  music?: MusicTrack[];
  tags: string[];
  /** Draft posts are skipped in production listings, RSS and sitemap. */
  draft: boolean;
  /** Raw MDX source, rendered with next-mdx-remote/rsc. */
  source: string;
  readingMinutes: number;
};

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function parseTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

function parseMusic(raw: unknown): MusicTrack[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const tracks = raw
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => ({
      title: typeof item.title === 'string' ? item.title : '',
      artist: typeof item.artist === 'string' ? item.artist : undefined,
      url: typeof item.url === 'string' ? item.url : undefined,
      note: typeof item.note === 'string' ? item.note : undefined,
    }))
    .filter((track) => track.title);
  return tracks.length > 0 ? tracks : undefined;
}

/** YAML parses `2026-08-14` as a Date; normalize to an ISO date string. */
function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') return value;
  return '';
}

/**
 * For 旧笺 originalDate: YAML may parse `2016` as a number, `2017-10-21` as a
 * Date, and `2021-06` as a string — normalize all of them to `YYYY[-MM[-DD]]`.
 */
function toOriginalDateString(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') return value;
  if (typeof value === 'number' && Number.isInteger(value) && value > 1900 && value < 2200) {
    return String(value);
  }
  return undefined;
}

function estimateReadingMinutes(lang: Locale, body: string): number {
  // Strip code fences for a fairer estimate.
  const text = body.replace(/```[\s\S]*?```/g, ' ');
  if (lang === 'zh') {
    const chars = text.replace(/\s+/g, '').length;
    return Math.max(1, Math.round(chars / 400));
  }
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function readPost(lang: Locale, slug: string): BlogPost | null {
  const file = path.join(BLOG_DIR, lang, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);

  const date = toDateString(data.date);
  if (!date) {
    throw new Error(`Missing frontmatter "date" in ${file}`);
  }
  const updated = toDateString(data.updated);

  return {
    slug,
    lang,
    title: typeof data.title === 'string' ? data.title : slug,
    description: typeof data.description === 'string' ? data.description : '',
    date,
    updated: updated || undefined,
    category: isCategoryId(data.category) ? data.category : 'fuguang',
    originalDate: toOriginalDateString(data.originalDate),
    rereadNote: typeof data.rereadNote === 'string' ? data.rereadNote : undefined,
    quote: typeof data.quote === 'string' ? data.quote : undefined,
    quoteSource: typeof data.quoteSource === 'string' ? data.quoteSource : undefined,
    cover: typeof data.cover === 'string' ? data.cover : undefined,
    music: parseMusic(data.music),
    tags: parseTags(data.tags),
    draft: data.draft === true,
    source: content.trim(),
    readingMinutes: estimateReadingMinutes(lang, content),
  };
}

/**
 * Published posts for one language, optionally filtered by category or tag.
 * Default order is newest first; the 旧笺 (jiujian) archive sorts by the
 * original writing year, oldest first — it accumulates like a paper archive.
 */
export function getPosts(lang: string, options?: { category?: string; tag?: string }): BlogPost[] {
  if (!isValidLocale(lang)) return [];
  const dir = path.join(BLOG_DIR, lang);
  if (!fs.existsSync(dir)) return [];

  const posts = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => readPost(lang, file.replace(/\.mdx$/, '')))
    .filter((post): post is BlogPost => post !== null && !post.draft)
    .filter((post) => {
      if (options?.category && post.category !== options.category) return false;
      if (options?.tag && !post.tags.includes(options.tag)) return false;
      return true;
    });

  if (options?.category === 'jiujian') {
    return posts.sort(
      (a, b) =>
        (a.originalDate ?? '9999-99').localeCompare(b.originalDate ?? '9999-99') ||
        a.date.localeCompare(b.date),
    );
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getPost(lang: string, slug: string): BlogPost | null {
  if (!isValidLocale(lang)) return null;
  const post = readPost(lang, slug);
  if (!post || post.draft) return null;
  return post;
}

/** Every published post across both languages (used for static params and sitemap). */
export function getAllPosts(): BlogPost[] {
  return locales.flatMap((lang) => getPosts(lang));
}

/** Distinct slugs of published posts (used for generateStaticParams; drafts are never prerendered). */
export function getAllSlugs(): string[] {
  return [...new Set(getAllPosts().map((post) => post.slug))];
}

export function getPostsByTag(lang: string, tag: string): BlogPost[] {
  return getPosts(lang, { tag });
}

/** Post counts per category, always in the canonical category order. */
export function getCategoryCounts(lang: string): Array<{ category: Category; count: number }> {
  const posts = getPosts(lang);
  return CATEGORIES.map((category) => ({
    category,
    count: posts.filter((post) => post.category === category.id).length,
  }));
}

/** Distinct tags with counts, most used first. */
export function getAllTags(lang: string): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>();
  for (const post of getPosts(lang)) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Posts grouped by publication year, newest year first (for the archive page). */
export function getArchiveGroups(lang: string): Array<{ year: string; posts: BlogPost[] }> {
  const groups = new Map<string, BlogPost[]>();
  for (const post of getPosts(lang)) {
    const year = post.date.slice(0, 4);
    const bucket = groups.get(year);
    if (bucket) bucket.push(post);
    else groups.set(year, [post]);
  }
  return [...groups.entries()]
    .map(([year, posts]) => ({ year, posts }))
    .sort((a, b) => b.year.localeCompare(a.year));
}

export function formatPostDate(date: string, lang: Locale): string {
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Formats an original writing date (`2019`, `2019-06`, `2019-06-15`). */
export function formatOriginalDate(value: string, lang: Locale): string {
  const match = value.match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);
  if (!match) return value;
  const [, year, month, day] = match;
  if (lang === 'zh') {
    return `${year} 年${month ? ` ${parseInt(month, 10)} 月` : ''}${day ? ` ${parseInt(day, 10)} 日` : ''}`;
  }
  if (!month) return year;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthName = months[parseInt(month, 10) - 1] ?? month;
  return day ? `${parseInt(day, 10)} ${monthName} ${year}` : `${monthName} ${year}`;
}

/** The original writing year as a short label, e.g. `2019` — used on cards. */
export function originalYearLabel(post: BlogPost): string | null {
  const year = post.originalDate?.slice(0, 4);
  return year ? year : null;
}

export function readingTimeLabel(post: BlogPost): string {
  return post.lang === 'zh'
    ? `约 ${post.readingMinutes} 分钟`
    : `${post.readingMinutes} min read`;
}

/** Public URL path of a post for a given language. */
export function postPath(lang: string, slug: string): string {
  return lang === 'zh' ? `/zh/posts/${slug}/` : `/posts/${slug}/`;
}
