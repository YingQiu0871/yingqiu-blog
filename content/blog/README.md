# 内容模型（秋水有信）

文章放在 `content/blog/{en,zh}/` 下，一篇一个 `.mdx` 文件，文件名（不含扩展名）即 slug；中英两版用相同文件名配对。

## 五个栏目（category，一级分类）

栏目是**长期稳定**的结构，不随文章增多而膨胀。具体主题一律用 tags 表达。

| id       | 中文 | 英文 | 中文 URL            | 英文 URL            | 含义           |
| -------- | ---- | ---- | ------------------- | ------------------- | -------------- |
| fuguang  | 浮光 | Moments | `/zh/fuguang/`      | `/moments/`         | 现在的我       |
| jiujian  | 旧笺 | Old Letters | `/zh/jiujian/`      | `/old-letters/`     | 过去的我       |
| liusheng | 流声 | Music | `/zh/liusheng/`     | `/music/`           | 我喜欢的       |
| qiushu   | 求索 | Quest | `/zh/qiushu/`       | `/quest/`           | 我追寻的       |
| shiju    | 拾句 | Quotes | `/zh/shiju/`        | `/quotes/`          | 我遇见的       |

`category` 缺省或写错时回退为 `fuguang`，不会导致构建失败。

## Front matter

```yaml
---
title: '文章标题'
description: '一句话摘要（卡片、RSS、SEO）'
date: 2026-08-14            # 必填：整理/发布到博客的日期
updated: 2026-08-16         # 可选
category: fuguang           # 五个栏目 id 之一，见上表
tags: [日常, 巴黎]           # 主题标签，逗号分隔字符串也可以
draft: false                # 可选：true 时不出现在列表/RSS/sitemap
cover: /images/covers/xxx.jpg  # 可选：卡片封面
# —— 旧笺（jiujian）专用 ——
originalDate: 2019-06       # 原作时间：2019 / 2019-06 / 2019-06-15 均可
rereadNote: '多年后重读：……'   # 可选：正文前的按语
# —— 拾句（shiju）专用 ——
quote: '句子原文'
quoteSource: '《书名》· 作者'
# —— 流声（liusheng）专用 ——
music:
  - title: 歌名
    artist: 歌手
    url: https://music.163.com/#/song?id=123   # 可选：外部链接
    note: 一句关于这首歌的记忆                    # 可选
---
```

- **旧笺**栏目按 `originalDate` 倒序排列（最近在前），其余栏目按 `date` 倒序。
- **流声**文章可在正文中用 `<Embed src="https://open.spotify.com/embed/track/…" height="152" />` 嵌入 Spotify / Apple Music / 网易云等 iframe 播放器。
- **拾句**的 `quote`/`quoteSource` 会在卡片和文章页渲染成摘句面板，正文可以只写一两句感想。

## 路由一览

| 页面 | 英文 | 中文 |
| ---- | ---- | ---- |
| 首页 | `/` | `/zh/` |
| 栏目页 | `/{en-slug}/` | `/zh/{zh-slug}/` |
| 文章页 | `/posts/{slug}/` | `/zh/posts/{slug}/` |
| 标签页 | `/tags/{tag}/` | `/zh/tags/{tag}/` |
| 归档页 | `/archive/` | `/zh/archive/` |

RSS：`/feed.xml`（构建前由 `scripts/generate-feed.mjs` 生成，勿手改）。
