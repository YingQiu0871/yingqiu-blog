import type { Metadata } from 'next';
import { getColumn } from '@/lib/columns';
import { createPageMetadata } from '@/lib/metadata';
import ColumnIndex from '@/components/ColumnIndex';

export const dynamic = 'force-static';

const column = getColumn('study-notes')!;

export function generateMetadata(): Metadata {
  return createPageMetadata('zh', `/qiushu/${column.zh.slug}/`, {
    en: { title: column.en.name, description: column.en.description },
    zh: { title: column.zh.name, description: column.zh.description },
  });
}

export default function ChineseColumnPage() {
  return <ColumnIndex lang="zh" column={column} />;
}
