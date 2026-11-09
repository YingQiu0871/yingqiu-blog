# 内容模型（秋水有信）

文章放在 `content/blog/{en,zh}/` 下，一篇一个 `.mdx` 文件，文件名（不含扩展名）即 slug；中英两版用相同文件名配对。

## 五个栏目（category，一级分类）

栏目是**长期稳定**的结构，不随文章增多而膨胀。具体主题一律用 tags 表达。

| id       | 中文 | 英文 | 中文 URL            | 英文 URL            | 含义           |
| -------- | ---- | ---- | ------------------- | ------------------- | -------------- |
| fuguang  | 浮光 | Moments | `/fuguang/`          | `/en/moments/`      | 现在的我       |
| jiujian  | 旧笺 | Old Letters | `/jiujian/`      | `/en/old-letters/`  | 过去的我       |
| liusheng | 流声 | Music | `/liusheng/`         | `/en/music/`        | 我喜欢的       |
| qiushu   | 求索 | Quest | `/qiushu/`           | `/en/quest/`        | 我追寻的       |
| bitan    | 笔谈 | Essays | `/bitan/`            | `/en/essays/`       | 我写下的：原创长文与整理稿 |

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
# —— 可选：正文前的摘句面板（原拾句栏目遗留，任何栏目都可用）——
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
- `quote`/`quoteSource` 会在卡片和文章页渲染成摘句面板；**笔谈**栏目放原创长文与整理稿，直接写正文即可。

## 路由一览

| 页面 | 中文 | 英文 |
| ---- | ---- | ---- |
| 首页 | `/` | `/en/` |
| 栏目页 | `/{zh-slug}/` | `/en/{en-slug}/` |
| 文章页 | `/posts/{slug}/` | `/en/posts/{slug}/` |
| 标签页 | `/tags/{tag}/` | `/en/tags/{tag}/` |
| 归档页 | `/archive/` | `/en/archive/` |

RSS：`/feed.xml`（构建前由 `scripts/generate-feed.mjs` 生成，勿手改）。

## 专栏（column）

专栏是挂在栏目下的子分组，在 `src/lib/columns.ts` 里声明，可以随时增加。专栏分两种：带阶段的（每个阶段一页）和不带阶段的（文章按 slug 顺序平铺，像一本书的章节，文章页底部自动出现上一篇 / 下一篇）。

### 求索 › 学习笔记（study-notes，带阶段）

`/qiushu/xuexi-biji/`，英文 `/en/quest/study-notes/`，按学习阶段分为大一、大二、大三、大四、M1、M2。写笔记时：

```yaml
category: qiushu
column: study-notes
stage: y1        # y1 大一 · y2 大二 · y3 大三 · y4 大四 · m1 · m2
```

没写 `stage` 的笔记不会出现在任何阶段页里。

### 笔谈 › 万倍Bit浪浪直播课（bit-course，不带阶段）

`/bitan/bit-langlang/`，英文 `/en/essays/bit-langlang-course/`。32 节直播课的整理稿，文件名 `bit-course-00.mdx`（总览）到 `bit-course-32.mdx`，按文件名排序，所以新加一节时沿用两位数编号即可：

```yaml
category: bitan
column: bit-course
```

来源是 io.traderax.net 公开整理的语音转写稿；整理规范（去口语、按话题分节、保留全部方法内容、纠正识别错字）记录在每篇文章开头的来源引用块之后的正文里即可，不另设字段。
