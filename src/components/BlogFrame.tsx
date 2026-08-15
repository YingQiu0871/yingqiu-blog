'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';
import {
  CATEGORIES,
  archivePath,
  categoryName,
  categoryPath,
  getCategoryBySlug,
} from '@/lib/categories';
import { MAIN_SITE_URL } from '@/lib/metadata';

const SITE_FEED = '/feed.xml';

export default function BlogFrame({
  lang,
  children,
}: {
  lang: Locale;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const homePath = (locale: Locale) => (locale === 'zh' ? '/zh/' : '/');

  const switchLanguage = (nextLang: Locale): string => {
    if (nextLang === lang) return pathname;
    const isZhPath = pathname.startsWith('/zh');
    const rest = isZhPath ? pathname.replace(/^\/zh/, '') : pathname;
    const base = rest === '' ? '/' : rest;
    const firstSegment = base.split('/')[1] ?? '';

    // Category pages: map the slug across languages.
    const category = getCategoryBySlug(lang, firstSegment);
    if (category) return categoryPath(nextLang, category.id);

    if (base.startsWith('/archive')) return archivePath(nextLang);
    // Tags differ between languages; land on the counterpart archive page.
    if (base.startsWith('/tags/')) return archivePath(nextLang);
    if (base.startsWith('/posts/')) {
      const slug = base.replace('/posts/', '').replace(/\/$/, '');
      return nextLang === 'zh' ? `/zh/posts/${slug}/` : `/posts/${slug}/`;
    }
    return homePath(nextLang);
  };

  const isActive = (href: string) => (href === homePath(lang) ? pathname === href : pathname === href);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
  };

  return (
    <div className="blog-frame">
      <div className="petals" aria-hidden="true">
        {Array.from({ length: 24 }, (_, index) => (
          <span className="petal" key={index} />
        ))}
      </div>
      <header className="blog-header">
        <div className="blog-header-inner">
          <Link className="blog-brand" href={homePath(lang)}>
            <span className="brand-mark" aria-hidden="true">
              <img src="/images/avatar.jpg" alt="" width={460} height={460} />
            </span>
            <span className="brand-copy">
              <strong>{lang === 'zh' ? '秋水有信' : 'Qiushui Youxin'}</strong>
              <small>
                {lang === 'zh' ? '随笔 · 信笺 · 片段' : 'Notes · Letters · Fragments'}
              </small>
            </span>
          </Link>

          <nav className="category-strip" aria-label={lang === 'zh' ? '栏目导航' : 'Section navigation'}>
            <Link className={isActive(homePath(lang)) ? 'active' : ''} href={homePath(lang)}>
              {lang === 'zh' ? '首页' : 'Home'}
            </Link>
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                className={isActive(categoryPath(lang, category.id)) ? 'active' : ''}
                href={categoryPath(lang, category.id)}
              >
                {categoryName(category, lang)}
              </Link>
            ))}
          </nav>

          <nav className="blog-nav" aria-label={lang === 'zh' ? '博客导航' : 'Blog navigation'}>
            <a href={MAIN_SITE_URL} target="_blank" rel="noreferrer">
              {lang === 'zh' ? '学术主页' : 'Portfolio'} ↗
            </a>
            <Link
              className="language-link"
              href={switchLanguage(lang === 'en' ? 'zh' : 'en')}
              lang={lang === 'en' ? 'zh' : 'en'}
              hrefLang={lang === 'en' ? 'zh' : 'en'}
            >
              {lang === 'en' ? '中文' : 'EN'}
            </Link>
            <button
              className="theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={lang === 'zh' ? '切换明暗主题' : 'Toggle light and dark theme'}
            >
              <span className="theme-icon theme-icon-light" aria-hidden="true">
                ☀
              </span>
              <span className="theme-icon theme-icon-dark" aria-hidden="true">
                ☾
              </span>
            </button>
          </nav>
        </div>
      </header>

      <main className="blog-main">{children}</main>

      <footer className="blog-footer">
        <span>
          {lang === 'zh' ? '© 2026 谷昱宁 · ' : '© 2026 Yuning Gu · '}
          <a href={`${SITE_FEED}`}>RSS</a>
          {' · '}
          <Link href={archivePath(lang)}>{lang === 'zh' ? '归档' : 'Archive'}</Link>
        </span>
        <a href={MAIN_SITE_URL} target="_blank" rel="noreferrer">
          yingqiu.me ↗
        </a>
      </footer>
    </div>
  );
}
