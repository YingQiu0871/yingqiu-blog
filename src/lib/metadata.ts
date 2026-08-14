import type { Metadata } from 'next';

// Canonical blog URL: override at build time with NEXT_PUBLIC_SITE_URL.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog.yingqiu.me';

export const MAIN_SITE_URL = 'https://yingqiu.me';

const siteName = 'Yuning Gu · Blog';

export function createPageMetadata(
  lang: 'en' | 'zh',
  pathname: string,
  copy: {
    en: { title: string; description: string };
    zh: { title: string; description: string };
  },
): Metadata {
  const localized = copy[lang];
  const url = `${SITE_URL}${pathname}`;

  return {
    title: {
      default: lang === 'zh' ? '谷昱宁的博客' : 'Yuning Gu · Blog',
      template: lang === 'zh' ? '%s | 谷昱宁的博客' : '%s | Yuning Gu',
    },
    description: localized.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title: `${localized.title} | ${siteName}`,
      description: localized.description,
      siteName,
      locale: lang === 'zh' ? 'zh_CN' : 'en_GB',
      images: [
        {
          url: `${SITE_URL}/og.png`,
          width: 1733,
          height: 909,
          alt: 'Yuning Gu — Blog',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: localized.title,
      description: localized.description,
      images: [`${SITE_URL}/og.png`],
    },
  };
}
