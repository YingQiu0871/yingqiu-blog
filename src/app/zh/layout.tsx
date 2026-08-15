import type { Metadata, Viewport } from 'next';
// Self-hosted fonts (fontsource, unicode-range sliced) — no Google Fonts fetch at build time.
import '@fontsource/baloo-2/600.css';
import '@fontsource/baloo-2/700.css';
import '@fontsource/baloo-2/800.css';
import '@fontsource/zcool-kuaile/index.css';
import '../globals.css';
import BlogFrame from '@/components/BlogFrame';
import ThemeScript from '@/components/ThemeScript';

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
    <html lang="zh" suppressHydrationWarning>
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
