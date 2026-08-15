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
    default: 'Qiushui Youxin',
    template: '%s | Qiushui Youxin',
  },
  description:
    'Notes, letters and fragments by Yingqiu — on life, old writings, music, reading, and the long road of learning.',
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.css"
        />
      </head>
      <body>
        <BlogFrame lang="en">{children}</BlogFrame>
      </body>
    </html>
  );
}
