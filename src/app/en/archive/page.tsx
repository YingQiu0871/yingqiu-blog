import { createPageMetadata } from '@/lib/metadata';
import ArchiveIndex from '@/components/ArchiveIndex';

export const dynamic = 'force-static';

export function generateMetadata() {
  return createPageMetadata('en', '/en/archive/', {
    en: {
      title: 'Archive',
      description: 'Every post on Qiushui Youxin, filed by year — notes, letters and fragments by Yingqiu.',
    },
    zh: {
      title: '归档',
      description: '秋水有信的全部文章，按年份归档 — 来自 Yingqiu 的笔记与信笺。',
    },
  });
}

export default function EnglishArchivePage() {
  return <ArchiveIndex lang="en" />;
}
