/**
 * Columns are sub-sections that live inside a category. Unlike categories they
 * may grow over time; a post joins one via `column` (+ optional `stage`) in
 * its front matter.
 *
 *   求索 › 学习笔记 (study-notes)      zh: /qiushu/xuexi-biji/   en: /en/quest/study-notes/
 *   笔谈 › 万倍Bit浪浪直播课 (bit-course) zh: /bitan/bit-langlang/  en: /en/essays/bit-langlang-course/
 *
 * A column either has stages (posts are grouped, each stage gets its own page)
 * or none (posts are listed in slug order on the column page, like chapters).
 */

import { getCategory, type CategoryId } from '@/lib/categories';

export const STAGE_IDS = ['y1', 'y2', 'y3', 'y4', 'm1', 'm2'] as const;
export type StageId = (typeof STAGE_IDS)[number];

export type Stage = {
  id: StageId;
  zh: { name: string; note: string };
  en: { name: string; note: string };
};

export const STUDY_NOTES_STAGES: Stage[] = [
  { id: 'y1', zh: { name: '大一', note: '本科第一年' }, en: { name: 'Year 1', note: 'Undergraduate, first year' } },
  { id: 'y2', zh: { name: '大二', note: '本科第二年' }, en: { name: 'Year 2', note: 'Undergraduate, second year' } },
  { id: 'y3', zh: { name: '大三', note: '本科第三年' }, en: { name: 'Year 3', note: 'Undergraduate, third year' } },
  { id: 'y4', zh: { name: '大四', note: '本科第四年' }, en: { name: 'Year 4', note: 'Undergraduate, fourth year' } },
  { id: 'm1', zh: { name: 'M1', note: '硕士一年级 · 巴黎萨克雷大学' }, en: { name: 'M1', note: 'Master’s year 1 · Université Paris-Saclay' } },
  { id: 'm2', zh: { name: 'M2', note: '硕士二年级 · 巴黎萨克雷大学' }, en: { name: 'M2', note: 'Master’s year 2 · Université Paris-Saclay' } },
];

export const COLUMN_IDS = ['study-notes', 'bit-course'] as const;
export type ColumnId = (typeof COLUMN_IDS)[number];

export type ColumnLocaleCopy = {
  name: string;
  slug: string;
  description: string;
  /** Word for one post in this column, e.g. 笔记 / 课. */
  unit: string;
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
    },
    en: {
      name: 'Study Notes',
      slug: 'study-notes',
      description: 'Course and reading notes, organised by stage — from first year to M2.',
      unit: 'note',
    },
    stages: STUDY_NOTES_STAGES,
  },
  {
    id: 'bit-course',
    category: 'bitan',
    zh: {
      name: '万倍Bit浪浪直播课',
      slug: 'bit-langlang',
      description:
        '2023 年 9 月到 2024 年 6 月的 32 场直播课，从语音转写稿整理成文：情绪周期、箱体与突破、龙头与补涨、止损与心态。',
      unit: '课',
    },
    en: {
      name: 'Bit Langlang Live Course',
      slug: 'bit-langlang-course',
      description:
        'Thirty-two live trading lessons (September 2023 to June 2024), edited from speech transcripts: market cycles, ranges and breakouts, leaders and catch-up moves, stops and psychology.',
      unit: 'lesson',
    },
    stages: [],
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
