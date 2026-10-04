import type { Locale } from '@/lib/i18n/config';
import { getPosts } from '@/lib/blog';
import { categoryName, type Category } from '@/lib/categories';
import Link from 'next/link';
import { COLUMNS, columnPath } from '@/lib/columns';
import PostCard from '@/components/PostCard';
import PlaylistIndex from '@/components/PlaylistIndex';

export default function CategoryIndex({
  lang,
  category,
}: {
  lang: Locale;
  category: Category;
}) {
  const posts = getPosts(lang, { category: category.id });
  const copy = lang === 'zh' ? category.zh : category.en;

  return (
    <>
      <header className="blog-heading">
        <p className="eyebrow">{lang === 'zh' ? '栏目' : 'Section'}</p>
        <h1>{categoryName(category, lang)}</h1>
        <p>{copy.description}</p>
      </header>

      {COLUMNS.filter((column) => column.category === category.id).map((column) => {
        const colCopy = lang === 'zh' ? column.zh : column.en;
        return (
          <Link key={column.id} className="column-card" href={columnPath(lang, column.id)}>
            <span className="column-card-label">{lang === 'zh' ? '专栏' : 'Column'}</span>
            <strong>{colCopy.name}</strong>
            <span>{colCopy.description}</span>
            <span className="column-card-stages">
              {column.stages.map((stage) => (lang === 'zh' ? stage.zh.name : stage.en.name)).join(' · ')}
            </span>
          </Link>
        );
      })}

      {posts.length === 0 ? (
        <div className="content-card empty-state">
          <p>
            {lang === 'zh'
              ? '这里还空着——第一篇会慢慢到来。'
              : 'Nothing here yet — the first page will come in time.'}
          </p>
        </div>
      ) : (
        <div className="stack-list">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} lang={lang} />
          ))}
        </div>
      )}

      {category.id === 'liusheng' && <PlaylistIndex lang={lang} embedded />}
    </>
  );
}
