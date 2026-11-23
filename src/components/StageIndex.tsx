import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { getColumnPosts } from '@/lib/blog';
import { categoryName, categoryPath, getCategory } from '@/lib/categories';
import { columnPath, stagePath, type Column, type Stage } from '@/lib/columns';
import PostCard from '@/components/PostCard';

/** Posts of one stage in reading order. */
export function stagePosts(lang: Locale, column: Column, stage: Stage) {
  const posts = getColumnPosts(lang, column.id).filter((post) => post.stage === stage.id);
  return stage.sequential
    ? posts.sort((a, b) => a.slug.localeCompare(b.slug))
    : posts.sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0));
}

/** One stage (e.g. 大一) of a column, on its own page. */
export default function StageIndex({
  lang,
  column,
  stage,
}: {
  lang: Locale;
  column: Column;
  stage: Stage;
}) {
  // Course notes read best in title order (e.g. 大一上 before 大一下, TU17 before TU23);
  // a sequential stage is a numbered series and follows its slugs instead.
  const posts = stagePosts(lang, column, stage);
  const category = getCategory(column.category);
  const colName = lang === 'zh' ? column.zh.name : column.en.name;
  const sc = lang === 'zh' ? stage.zh : stage.en;

  return (
    <>
      <header className="blog-heading">
        <p className="eyebrow">
          {category && <Link href={categoryPath(lang, category.id)}>{categoryName(category, lang)}</Link>}
          {' › '}
          <Link href={columnPath(lang, column.id)}>{colName}</Link>
        </p>
        <h1>{sc.name}</h1>
        <p>{sc.note}</p>
      </header>

      <nav
        className="stage-tabs"
        data-count={column.stages.length}
        aria-label={lang === 'zh' ? '专栏分组' : 'Column groups'}
      >
        {column.stages.map((item) => (
          <Link
            key={item.id}
            href={stagePath(lang, column.id, item.id)}
            className={item.id === stage.id ? 'active' : ''}
            aria-current={item.id === stage.id ? 'page' : undefined}
          >
            {lang === 'zh' ? item.zh.name : item.en.name}
          </Link>
        ))}
      </nav>

      {posts.length === 0 ? (
        <div className="content-card empty-state">
          <p>
            {lang === 'zh'
              ? '这一部分还在整理中。'
              : 'This part is still being gathered.'}
          </p>
        </div>
      ) : (
        <div className="stack-list">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} lang={lang} />
          ))}
        </div>
      )}
    </>
  );
}
