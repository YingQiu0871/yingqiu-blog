/**
 * Columns are sub-sections that live inside a category. Unlike categories they
 * may grow over time; a post joins one via `column` (+ optional `stage`) in
 * its front matter.
 *
 *   求索 › 学习笔记 (study-notes)
 *   zh: /qiushu/xuexi-biji/   en: /en/quest/study-notes/
 */

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

export type Column = {
  id: 'study-notes';
  /** Parent category id. */
  category: 'qiushu';
  zh: { name: string; slug: string; description: string };
  en: { name: string; slug: string; description: string };
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
    },
    en: {
      name: 'Study Notes',
      slug: 'study-notes',
      description: 'Course and reading notes, organised by stage — from first year to M2.',
    },
    stages: STUDY_NOTES_STAGES,
  },
];

export function isStageId(value: unknown): value is StageId {
  return typeof value === 'string' && (STAGE_IDS as readonly string[]).includes(value);
}

export function getColumn(id: string): Column | undefined {
  return COLUMNS.find((column) => column.id === id);
}

export function stageName(stage: Stage, lang: string): string {
  return lang === 'zh' ? stage.zh.name : stage.en.name;
}

/** Public path of a column, e.g. `/qiushu/xuexi-biji/` or `/en/quest/study-notes/`. */
export function columnPath(lang: string, columnId: string): string {
  const column = getColumn(columnId);
  if (!column) return lang === 'zh' ? '/' : '/en/';
  return lang === 'zh' ? `/qiushu/${column.zh.slug}/` : `/en/quest/${column.en.slug}/`;
}
