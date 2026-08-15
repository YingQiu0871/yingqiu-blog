# Yuning Gu — Blog

Independent bilingual blog at [blog.yingqiu.me](https://blog.yingqiu.me), separate
from the academic portfolio at [yingqiu.me](https://yingqiu.me).
Built with Next.js (static export), MDX posts, and an RSS feed; deployed by
GitHub Actions to the same VPS as the portfolio (`/var/www/blog`).

## Structure

- `content/blog/en` · `content/blog/zh` — posts, one MDX file per language (paired by filename)
- `src/lib/blog.ts` — content pipeline
- `src/app/` — Chinese routes at the root (`/`, `/posts/<slug>`, `/fuguang/` …)
- `src/app/en` — English routes (`/en/`, `/en/posts/<slug>`)
- `scripts/generate-feed.mjs` — regenerates `public/feed.xml` before every build
- `.github/workflows/deploy.yml` — build + rsync to `/var/www/blog`

## Writing a post

Create `content/blog/<en|zh>/<slug>.mdx` with YAML front matter
(`title`, `description`, `date`, optional `updated`, `tags`, `draft`).
The same filename in both language folders links the translations; a missing
translation shows a friendly fallback panel. Full manual: the on-site guide
*“Writing a post on this blog”*.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Static site in `out/`, RSS regenerated automatically (prebuild hook).
Deployment and server setup: see `deploy/DEPLOY.md` in the portfolio repository.

## Site URL

```bash
NEXT_PUBLIC_SITE_URL=https://blog.yingqiu.me npm run build
```
