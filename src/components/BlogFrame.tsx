'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';
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

  const switchLanguage = (nextLang: Locale): string => {
    if (nextLang === 'zh') {
      if (pathname.startsWith('/zh')) return pathname;
      return pathname === '/' ? '/zh/' : `/zh${pathname}`;
    }
    if (pathname.startsWith('/zh')) {
      const rest = pathname.replace(/^\/zh/, '');
      return rest === '' || rest === '/' ? '/' : rest;
    }
    return pathname;
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
  };

  return (
    <div className="blog-frame">
      <div className="petals" aria-hidden="true">
        <span className="petal" />
        <span className="petal" />
        <span className="petal" />
        <span className="petal" />
        <span className="petal" />
        <span className="petal" />
        <span className="petal" />
        <span className="petal" />
      </div>
      <header className="blog-header">
        <div className="blog-header-inner">
          <Link className="blog-brand" href={lang === 'zh' ? '/zh/' : '/'}>
            <span className="brand-mark" aria-hidden="true">
              🌸
            </span>
            <span className="brand-copy">
              <strong>{lang === 'zh' ? '谷昱宁的博客' : 'Yuning Gu · Blog'}</strong>
              <small>
                {lang === 'zh' ? '随笔 · 笔记 · 科研手记' : 'Notes · Writing · Research'}
              </small>
            </span>
          </Link>

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
        </span>
        <a href={MAIN_SITE_URL} target="_blank" rel="noreferrer">
          yingqiu.me ↗
        </a>
      </footer>
    </div>
  );
}
