import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { getAllTags, getArchiveGroups } from '@/lib/blog';
import { tagPath } from '@/lib/categories';
import PostCard from '@/components/PostCard';

export default function ArchiveIndex({ lang }: { lang: Locale }) {
  const groups = getArchiveGroups(lang);
  const tags = getAllTags(lang);

  return (
    <>
      <header className="blog-heading">
        <p className="eyebrow">{lang === 'zh' ? '归档' : 'Archive'}</p>
        <h1>{lang === 'zh' ? '所有文章' : 'Everything so far'}</h1>
        <p>
          {lang === 'zh'
            ? '按年份归档的全部文章，以及所有标签。'
            : 'Every post by year, and the full list of tags.'}
        </p>
      </header>

      {groups.map(({ year, posts }) => (
        <section className="archive-year" key={year}>
          <h2>{year}</h2>
          <div className="stack-list">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} lang={lang} showCategory />
            ))}
          </div>
        </section>
      ))}

      {tags.length > 0 && (
        <section className="archive-tags">
          <h2>{lang === 'zh' ? '标签' : 'Tags'}</h2>
          <div className="tag-cloud">
            {tags.map(({ tag, count }) => (
              <Link className="tag" key={tag} href={tagPath(lang, tag)}>
                {tag}
                <span className="tag-count">{count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
