# @gocanto/writing

Source for [writing.gocanto.sh](https://writing.gocanto.sh) — engineering notes by
Gustavo Ocanto. A [VitePress](https://vitepress.dev) site, markdown-first and
data-driven: the post index is built from the files in `posts/` at build time.

## Local development

```sh
pnpm --filter @gocanto/writing dev       # dev server with HMR
pnpm --filter @gocanto/writing build     # static build -> .vitepress/dist
pnpm --filter @gocanto/writing preview    # preview the built site
```

## Adding a post

Drop a markdown file in `posts/`. Frontmatter drives the index and metadata:

```md
---
title: My Post Title
date: 2026-07-18
description: One-line summary used on the index and social cards.
tags: [go, edge]
---

# My Post Title

Body...
```

The file `posts/<slug>.md` publishes at the clean URL `writing.gocanto.sh/<slug>`
(the `posts/` segment is stripped by a rewrite in `.vitepress/config.ts`). The index
page (`index.md`) lists all posts newest-first via `posts.data.ts`
(`createContentLoader`).

## Deployment (separate Vercel project)

`writing.gocanto.sh` deploys as its **own** Vercel project, distinct from the
`gocanto-sh` project that serves the profile site. Both point at this repo; Vercel
projects on one repo can't share a root `vercel.json`, so configure project B in the
dashboard:

| Setting | Value |
| --- | --- |
| Root Directory | `./` (repo root — needed for the pnpm workspace install) |
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm turbo run build --filter=@gocanto/writing --cache-dir storage/.cache/turbo` |
| Output Directory | `workspace/writing/.vitepress/dist` |

Then add the domain:

1. Project B → Settings → Domains → add `writing.gocanto.sh`.
2. Create a DNS `CNAME` record: `writing` → the target Vercel shows (typically
   `cname.vercel-dns.com`).

The profile site (`gocanto.sh`) links here from its top nav.
