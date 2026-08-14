import type { MetadataRoute } from 'next';
import { getAllPosts, postPath } from '@/lib/blog';
import { SITE_URL } from '@/lib/metadata';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const postEntries = posts.map((post) => {
    const counterpart = posts.find((p) => p.slug === post.slug && p.lang !== post.lang);
    return {
      url: `${SITE_URL}${postPath(post.lang, post.slug)}`,
      lastModified: post.updated ?? post.date,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(counterpart
        ? {
            alternates: {
              languages: {
                en: `${SITE_URL}${postPath('en', post.slug)}`,
                zh: `${SITE_URL}${postPath('zh', post.slug)}`,
              },
            },
          }
        : {}),
    };
  });

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date('2026-08-14'),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/zh/`,
      lastModified: new Date('2026-08-14'),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...postEntries,
  ];
}
