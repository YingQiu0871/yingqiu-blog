import type { Metadata } from 'next';
import { columnPath, getColumn } from '@/lib/columns';
import { createPageMetadata } from '@/lib/metadata';
import ColumnIndex from '@/components/ColumnIndex';

export const dynamic = 'force-static';

const column = getColumn('crypto-notes')!;

export function generateMetadata(): Metadata {
  return createPageMetadata('zh', columnPath('zh', column.id), {
    en: { title: column.en.name, description: column.en.description },
    zh: { title: column.zh.name, description: column.zh.description },
  });
}

export default function ChineseCryptoNotesPage() {
  return <ColumnIndex lang="zh" column={column} />;
}
