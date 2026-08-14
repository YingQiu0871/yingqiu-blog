import type { Metadata, Viewport } from 'next';
import '../globals.css';
import BlogFrame from '@/components/BlogFrame';
import ThemeScript from '@/components/ThemeScript';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f7fc' },
    { media: '(prefers-color-scheme: dark)', color: '#071426' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: '谷昱宁的博客',
    template: '%s | 谷昱宁的博客',
  },
  description: '关于药物科学、科研方法与学习生活的随笔与笔记。',
};

export default function ChineseLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <BlogFrame lang="zh">{children}</BlogFrame>
      </body>
    </html>
  );
}
