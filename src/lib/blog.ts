import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { isValidLocale, locales, type Locale } from '@/lib/i18n/config';

export type BlogPost = {
  slug: string;
  lang: Locale;
  title: string;
  description: string;
  /** ISO date, e.g. 2026-08-14 */
  date: string;
  updated?: string;
  tags: string[];
  /** Draft posts are skipped in production listings and sitemap */
  draft: boolean;
  /** Raw MDX source, rendered with next-mdx-remote/rsc */
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

/** YAML parses `2026-08-14` as a Date; normalize to an ISO date string. */
function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') return value;
  return '';
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
    tags: parseTags(data.tags),
    draft: data.draft === true,
    source: content.trim(),
    readingMinutes: estimateReadingMinutes(lang, content),
  };
}

/** All published posts for one language, newest first. */
export function getPosts(lang: string): BlogPost[] {
  if (!isValidLocale(lang)) return [];
  const dir = path.join(BLOG_DIR, lang);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => readPost(lang, file.replace(/\.mdx$/, '')))
    .filter((post): post is BlogPost => post !== null && !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
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

export function formatPostDate(date: string, lang: Locale): string {
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
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
