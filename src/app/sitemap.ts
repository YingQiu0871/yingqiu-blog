import type { MetadataRoute } from 'next';
import { getAllPosts, getAllTags, postPath } from '@/lib/blog';
import { CATEGORIES, archivePath, categoryPath, tagPath } from '@/lib/categories';
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

  const categoryEntries = CATEGORIES.flatMap((category) =>
    (['en', 'zh'] as const).map((lang) => ({
      url: `${SITE_URL}${categoryPath(lang, category.id)}`,
      lastModified: new Date('2026-08-14'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  );

  const tagEntries = (['en', 'zh'] as const).flatMap((lang) =>
    getAllTags(lang).map(({ tag }) => ({
      url: `${SITE_URL}${tagPath(lang, tag)}`,
      lastModified: new Date('2026-08-14'),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    })),
  );

  const archiveEntries = (['en', 'zh'] as const).map((lang) => ({
    url: `${SITE_URL}${archivePath(lang)}`,
    lastModified: new Date('2026-08-14'),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date('2026-08-14'),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/en/`,
      lastModified: new Date('2026-08-14'),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...categoryEntries,
    ...archiveEntries,
    ...tagEntries,
    ...postEntries,
  ];
}
