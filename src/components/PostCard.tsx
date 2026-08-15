import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import {
  formatOriginalDate,
  formatPostDate,
  originalYearLabel,
  postPath,
  readingTimeLabel,
  type BlogPost,
} from '@/lib/blog';
import { categoryName, getCategory, tagPath } from '@/lib/categories';

export default function PostCard({
  post,
  lang,
  showCategory = false,
}: {
  post: BlogPost;
  lang: Locale;
  /** Show the category chip; hide it on the category's own page. */
  showCategory?: boolean;
}) {
  const category = getCategory(post.category);
  const originalYear = originalYearLabel(post);
  const isOldLetter = post.category === 'jiujian' && !!originalYear;

  return (
    <article className="content-card">
      {post.cover && (
        <Link href={postPath(lang, post.slug)} tabIndex={-1} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export; covers live in /public */}
          <img className="card-cover" src={post.cover} alt="" loading="lazy" />
        </Link>
      )}

      <Link className="blog-card-link" href={postPath(lang, post.slug)}>
        {(showCategory || isOldLetter) && (
          <div className="card-topline">
            {showCategory && category && (
              <span className={`card-category cat-${post.category}`}>
                {categoryName(category, lang)}
              </span>
            )}
            {isOldLetter && (
              <span className="card-original-year">
                {lang === 'zh' ? `原作 ${originalYear}` : `Written ${originalYear}`}
              </span>
            )}
          </div>
        )}
        <h2>{post.title}</h2>
        <span className="meta">
          {isOldLetter && post.originalDate ? (
            <>
              <time dateTime={post.originalDate}>
                {lang === 'zh' ? '原作 ' : 'originally '}
                {formatOriginalDate(post.originalDate, lang)}
              </time>
              {' · '}
              <time dateTime={post.date}>{formatPostDate(post.date, lang)}</time>
            </>
          ) : (
            <time dateTime={post.date}>{formatPostDate(post.date, lang)}</time>
          )}
          {' · '}
          {readingTimeLabel(post)}
        </span>
        {post.quote ? (
          <p className="card-quote">
            “{post.quote}”
            {post.quoteSource && <span className="quote-source">— {post.quoteSource}</span>}
          </p>
        ) : (
          <p>{post.description}</p>
        )}
      </Link>

      {post.tags.length > 0 && (
        <div className="tag-list">
          {post.tags.map((tag) => (
            <Link className="tag" key={tag} href={tagPath(lang, tag)}>
              {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
