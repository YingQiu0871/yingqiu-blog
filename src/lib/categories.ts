/**
 * The five stable first-class categories of the blog.
 *
 * These are long-lived structural sections — do not grow this list as new
 * posts appear; topics belong to `tags` instead. URLs are also stable:
 *
 *   zh: /fuguang/ /jiujian/ /liusheng/ /qiushu/ /shiju/
 *   en: /en/moments/ /en/old-letters/ /en/music/ /en/quest/ /en/quotes/
 *
 * Narrative identity:
 *   浮光 = the self of now · 旧笺 = the self of then · 流声 = what I love
 *   求索 = what I seek · 拾句 = what I meet in other people's words and keep
 */

export const CATEGORY_IDS = ['fuguang', 'jiujian', 'liusheng', 'qiushu', 'shiju'] as const;
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
    id: 'shiju',
    accent: '#9b7fd4',
    zh: {
      name: '拾句',
      slug: 'shiju',
      description: '摘抄、诗词与书中的句子，从他人的文字里留下。',
      homeLine: '我遇见的 · 摘句、诗词与阅读',
    },
    en: {
      name: 'Quotes',
      slug: 'quotes',
      description: 'Quotes and poems kept from other people\u2019s words.',
      homeLine: 'What I meet — lines kept from reading',
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
