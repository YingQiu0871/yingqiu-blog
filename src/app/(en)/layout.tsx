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
    default: 'Yuning Gu · Blog',
    template: '%s | Yuning Gu',
  },
  description:
    'Notes on pharmaceutical sciences, research practice, and life between labs.',
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <BlogFrame lang="en">{children}</BlogFrame>
      </body>
    </html>
  );
}
