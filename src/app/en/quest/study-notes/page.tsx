import type { Metadata } from 'next';
import { getColumn } from '@/lib/columns';
import { createPageMetadata } from '@/lib/metadata';
import ColumnIndex from '@/components/ColumnIndex';

export const dynamic = 'force-static';

const column = getColumn('study-notes')!;

export function generateMetadata(): Metadata {
  return createPageMetadata('en', `/en/quest/${column.en.slug}/`, {
    en: { title: column.en.name, description: column.en.description },
    zh: { title: column.zh.name, description: column.zh.description },
  });
}

export default function EnglishColumnPage() {
  return <ColumnIndex lang="en" column={column} />;
}
