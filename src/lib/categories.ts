/**
 * The five stable first-class categories of the blog.
 *
 * These are long-lived structural sections — do not grow this list as new
 * posts appear; topics belong to `tags` instead. URLs are also stable:
 *
 *   zh: /fuguang/ /jiujian/ /liusheng/ /qiushu/ /bitan/
 *   en: /en/moments/ /en/old-letters/ /en/music/ /en/quest/ /en/essays/
 *
 * Narrative identity:
 *   浮光 = the self of now · 旧笺 = the self of then · 流声 = what I love
 *   求索 = what I seek · 笔谈 = what I write: original essays and long-form notes
 *
 * 笔谈 (bitan) replaced the earlier 拾句 (shiju, quotes) section in November
 * 2026. No post had been filed under shiju, so the id and both slugs changed.
 */

export const CATEGORY_IDS = ['fuguang', 'jiujian', 'liusheng', 'qiushu', 'bitan'] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export type CategoryLocaleCopy = {
  /** Display name used in nav, chips and headings. */
  name: string;
  /** URL slug for this language. */
  slug: string;
  /** One short sentence shown at the top of the category page. */
  description: string;
  /** One short line shown on the homepage section card. */
  homeLine: string;
};

export type Category = {
  id: CategoryId;
  /** Subtle accent colour for dots and chips (theme-adjacent, kept quiet). */
  accent: string;
  zh: CategoryLocaleCopy;
  en: CategoryLocaleCopy;
};

export const CATEGORIES: Category[] = [
  {
    id: 'fuguang',
    accent: '#ed6ea0',
    zh: {
      name: '浮光',
      slug: 'fuguang',
      description: '日常随笔与生活片段——记录此刻的我。',
      homeLine: '现在的我 · 日常随笔与生活片段',
    },
    en: {
      name: 'Moments',
      slug: 'moments',
      description: 'Days, travels and moods — the self of now.',
      homeLine: 'The self of now — days and small journeys',
    },
  },
  {
    id: 'jiujian',
    accent: '#d9a066',
    zh: {
      name: '旧笺',
      slug: 'jiujian',
      description: '童年与少年时代的旧稿，保留原貌，按原作年份归档。',
      homeLine: '过去的我 · 少年时代的旧稿',
    },
    en: {
      name: 'Old Letters',
      slug: 'old-letters',
      description: 'Writings from childhood and school years, kept as they were, filed by the year they were written.',
      homeLine: 'The self of then — writings from younger years',
    },
  },
  {
    id: 'liusheng',
    accent: '#5fb2e8',
    zh: {
      name: '流声',
      slug: 'liusheng',
      description: '喜欢的音乐、歌单，以及和歌有关的记忆。',
      homeLine: '我喜欢的 · 音乐、歌单与记忆',
    },
    en: {
      name: 'Music',
      slug: 'music',
      description: 'Music I love, playlists, and the memories tied to songs.',
      homeLine: 'What I love — songs and the memories they carry',
    },
  },
  {
    id: 'qiushu',
    accent: '#4a7fd4',
    zh: {
      name: '求索',
      slug: 'qiushu',
      description: '求学、科研与实验室里的长路。',
      homeLine: '我追寻的 · 求学、科研与远方',
    },
    en: {
      name: 'Quest',
      slug: 'quest',
      description: 'Study, research, and the long road through labs.',
      homeLine: 'What I seek — study, research, the road ahead',
    },
  },
  {
    id: 'bitan',
    accent: '#9b7fd4',
    zh: {
      name: '笔谈',
      slug: 'bitan',
      description: '原创长文与整理稿：把一件事想清楚，再写下来。',
      homeLine: '我写下的 · 原创长文与整理稿',
    },
    en: {
      name: 'Essays',
      slug: 'essays',
      description: 'Original essays and long-form notes: thinking something through, then writing it down.',
      homeLine: 'What I write — essays and long-form notes',
    },
  },
];

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === 'string' && (CATEGORY_IDS as readonly string[]).includes(value);
}

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((category) => category.id === id);
}

export function getCategoryBySlug(lang: string, slug: string): Category | undefined {
  return CATEGORIES.find((category) => (lang === 'zh' ? category.zh.slug : category.en.slug) === slug);
}

export function categoryName(category: Category, lang: string): string {
  return lang === 'zh' ? category.zh.name : category.en.name;
}

/** Stable public path of a category, e.g. `/fuguang/` or `/en/moments/`. */
export function categoryPath(lang: string, categoryId: string): string {
  const category = getCategory(categoryId);
  if (!category) return lang === 'zh' ? '/' : '/en/';
  const slug = lang === 'zh' ? category.zh.slug : category.en.slug;
  return lang === 'zh' ? `/${slug}/` : `/en/${slug}/`;
}

export function archivePath(lang: string): string {
  return lang === 'zh' ? '/archive/' : '/en/archive/';
}

export function tagPath(lang: string, tag: string): string {
  const encoded = encodeURIComponent(tag);
  return lang === 'zh' ? `/tags/${encoded}/` : `/en/tags/${encoded}/`;
}
