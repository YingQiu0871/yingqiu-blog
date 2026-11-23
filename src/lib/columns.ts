/**
 * Columns are sub-sections that live inside a category. Unlike categories they
 * may grow over time; a post joins one via `column` (+ optional `stage`) in
 * its front matter.
 *
 *   求索 › 学习笔记 (study-notes)   zh: /qiushu/xuexi-biji/   en: /en/quest/study-notes/
 *   笔谈 › 币圈笔记 (crypto-notes)  zh: /bitan/biquan-biji/    en: /en/essays/crypto-notes/
 *
 * A column either has stages (posts are grouped, each stage gets its own page)
 * or none (posts are listed in slug order on the column page, like chapters).
 * A stage marked `sequential` is read in slug order with previous / next links,
 * e.g. the 32-lesson live course under 币圈笔记.
 */

import { getCategory, type CategoryId } from '@/lib/categories';

export const STAGE_IDS = ['y1', 'y2', 'y3', 'y4', 'm1', 'm2', 'intro', 'reading', 'course'] as const;
export type StageId = (typeof STAGE_IDS)[number];

export type Stage = {
  id: StageId;
  zh: { name: string; note: string };
  en: { name: string; note: string };
  /** Posts form a numbered series: list them by slug and link previous / next. */
  sequential?: boolean;
};

export const STUDY_NOTES_STAGES: Stage[] = [
  { id: 'y1', zh: { name: '大一', note: '本科第一年' }, en: { name: 'Year 1', note: 'Undergraduate, first year' } },
  { id: 'y2', zh: { name: '大二', note: '本科第二年' }, en: { name: 'Year 2', note: 'Undergraduate, second year' } },
  { id: 'y3', zh: { name: '大三', note: '本科第三年' }, en: { name: 'Year 3', note: 'Undergraduate, third year' } },
  { id: 'y4', zh: { name: '大四', note: '本科第四年' }, en: { name: 'Year 4', note: 'Undergraduate, fourth year' } },
  { id: 'm1', zh: { name: 'M1', note: '硕士一年级 · 巴黎萨克雷大学' }, en: { name: 'M1', note: 'Master’s year 1 · Université Paris-Saclay' } },
  { id: 'm2', zh: { name: 'M2', note: '硕士二年级 · 巴黎萨克雷大学' }, en: { name: 'M2', note: 'Master’s year 2 · Université Paris-Saclay' } },
];

export const CRYPTO_NOTES_STAGES: Stage[] = [
  {
    id: 'intro',
    zh: { name: '入门', note: '从零开始：概念、工具、风险与规则' },
    en: { name: 'Basics', note: 'From zero: concepts, tools, risks and rules' },
  },
  {
    id: 'reading',
    zh: { name: '读书笔记', note: '读交易员的长文、专访和推文归档后做的归纳' },
    en: { name: 'Reading Notes', note: 'Summaries of traders’ essays, interviews and post archives' },
  },
  {
    id: 'course',
    zh: { name: '直播课整理', note: '万倍Bit浪浪直播课：2023 年 9 月到 2024 年 6 月的 30 课' },
    en: { name: 'Course Notes', note: 'Bit Langlang live course: 30 lessons, September 2023 to June 2024' },
    sequential: true,
  },
];

export const COLUMN_IDS = ['study-notes', 'crypto-notes'] as const;
export type ColumnId = (typeof COLUMN_IDS)[number];

export type ColumnLocaleCopy = {
  name: string;
  slug: string;
  description: string;
  /** Word for one post in this column, e.g. 笔记 / 课. */
  unit: string;
  /** Word for the column's groups, e.g. 阶段 / 分组 (en: stages / groups). */
  stageWord: string;
};

export type Column = {
  id: ColumnId;
  /** Parent category id. */
  category: CategoryId;
  zh: ColumnLocaleCopy;
  en: ColumnLocaleCopy;
  /** Empty for a flat, chapter-like column. */
  stages: Stage[];
};

export const COLUMNS: Column[] = [
  {
    id: 'study-notes',
    category: 'qiushu',
    zh: {
      name: '学习笔记',
      slug: 'xuexi-biji',
      description: '从大一到 M2，按学习阶段整理的课程与读书笔记。',
      unit: '篇笔记',
      stageWord: '阶段',
    },
    en: {
      name: 'Study Notes',
      slug: 'study-notes',
      description: 'Course and reading notes, organised by stage — from first year to M2.',
      unit: 'note',
      stageWord: 'stages',
    },
    stages: STUDY_NOTES_STAGES,
  },
  {
    id: 'crypto-notes',
    category: 'bitan',
    zh: {
      name: '币圈笔记',
      slug: 'biquan-biji',
      description: '关于加密货币的笔记：从零开始的入门、读交易员文字后的归纳，以及一门直播课的整理稿。',
      unit: '篇',
      stageWord: '分组',
    },
    en: {
      name: 'Crypto Notes',
      slug: 'crypto-notes',
      description:
        'Notes on crypto: a primer from zero, summaries of what traders have written and said, and an edited live course.',
      unit: 'note',
      stageWord: 'groups',
    },
    stages: CRYPTO_NOTES_STAGES,
  },
];

export function isStageId(value: unknown): value is StageId {
  return typeof value === 'string' && (STAGE_IDS as readonly string[]).includes(value);
}

export function isColumnId(value: unknown): value is ColumnId {
  return typeof value === 'string' && (COLUMN_IDS as readonly string[]).includes(value);
}

export function getColumn(id: string): Column | undefined {
  return COLUMNS.find((column) => column.id === id);
}

/** Columns that belong to one category, in declaration order. */
export function getColumnsOfCategory(categoryId: string): Column[] {
  return COLUMNS.filter((column) => column.category === categoryId);
}

export function columnName(column: Column, lang: string): string {
  return lang === 'zh' ? column.zh.name : column.en.name;
}

export function stageName(stage: Stage, lang: string): string {
  return lang === 'zh' ? stage.zh.name : stage.en.name;
}

/** `3 篇笔记` / `3 notes` / `32 课` / `32 lessons`. */
export function columnCountLabel(column: Column, lang: string, count: number): string {
  if (lang === 'zh') return `${count} ${column.zh.unit}`;
  return `${count} ${count === 1 ? column.en.unit : `${column.en.unit}s`}`;
}

/** Public path of a column, e.g. `/qiushu/xuexi-biji/` or `/en/quest/study-notes/`. */
export function columnPath(lang: string, columnId: string): string {
  const column = getColumn(columnId);
  const category = column ? getCategory(column.category) : undefined;
  if (!column || !category) return lang === 'zh' ? '/' : '/en/';
  return lang === 'zh'
    ? `/${category.zh.slug}/${column.zh.slug}/`
    : `/en/${category.en.slug}/${column.en.slug}/`;
}

/** Public path of one stage page, e.g. `/qiushu/xuexi-biji/y1/` or `/en/quest/study-notes/y1/`. */
export function stagePath(lang: string, columnId: string, stageId: string): string {
  return `${columnPath(lang, columnId)}${stageId}/`;
}

/**
 * Finds the column whose page a path belongs to, e.g. `/qiushu/xuexi-biji/y1/`
 * (zh) or `/essays/bit-langlang-course/` (en, with the `/en` prefix removed).
 * Returns the column and the stage id when the path points at a stage page.
 */
export function matchColumnPath(
  lang: string,
  pathWithoutLangPrefix: string,
): { column: Column; stageId?: string } | undefined {
  const [, categorySlug, columnSlug, stageId] = pathWithoutLangPrefix.split('/');
  if (!categorySlug || !columnSlug) return undefined;
  const column = COLUMNS.find((item) => {
    const category = getCategory(item.category);
    if (!category) return false;
    const copy = lang === 'zh' ? item.zh : item.en;
    const categoryCopy = lang === 'zh' ? category.zh : category.en;
    return categoryCopy.slug === categorySlug && copy.slug === columnSlug;
  });
  if (!column) return undefined;
  return { column, stageId: stageId || undefined };
}
