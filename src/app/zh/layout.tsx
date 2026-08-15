import type { Metadata, Viewport } from 'next';
import { Baloo_2, ZCOOL_KuaiLe } from 'next/font/google';
import '../globals.css';
import BlogFrame from '@/components/BlogFrame';
import ThemeScript from '@/components/ThemeScript';

const baloo = Baloo_2({
  weight: ['600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-baloo',
  display: 'swap',
});

const kuaiLe = ZCOOL_KuaiLe({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-kuai',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfbfb' },
    { media: '(prefers-color-scheme: dark)', color: '#21252b' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: '秋水有信',
    template: '%s | 秋水有信',
  },
  description: '来自 Yingqiu 的笔记、信笺与片段：生活、旧文、音乐、阅读，以及求索的长路。',
};

export default function ChineseLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" className={`${baloo.variable} ${kuaiLe.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.css"
        />
      </head>
      <body>
        <BlogFrame lang="zh">{children}</BlogFrame>
      </body>
    </html>
  );
}
