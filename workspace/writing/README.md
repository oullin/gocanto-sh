# @gocanto/writing

Source for [writing.gocanto.sh](https://writing.gocanto.sh) — engineering notes by
Gustavo Ocanto. A [VitePress](https://vitepress.dev) site, markdown-first and
data-driven: the post index is built from the files in `posts/` at build time.

## Local development

Like the profile app, this package runs behind [portless](https://portless.sh), so it
gets a stable HTTPS URL instead of a bare port. The `portless` key in `package.json`
names it `writing.gocanto-sh` and runs the `dev:site` script through the proxy:

```sh
pnpm --filter @gocanto/writing dev       # -> https://writing.gocanto-sh.localhost:1355
```

This mirrors production: `writing.gocanto-sh.localhost` locally maps to the
`writing.gocanto.sh` subdomain in prod, alongside the app's `gocanto-sh.localhost`.
The dev scripts pin `PORTLESS_PORT=1355`, so the shared proxy runs on port `1355`
(no sudo, no port `443`) — the URL carries the port. The proxy is shared with the
app: whichever dev server starts first brings it up, and each package registers its
own route on it (`portless list` shows them). The local CA is set up the first time
you run the app; subsequent runs, including this site, reuse it. Running `pnpm dev`
from the repo root starts every package's dev server on the one proxy.

Escape hatches that skip the proxy (plain ports):

```sh
pnpm --filter @gocanto/writing dev:site   # vitepress dev on :5175 (no proxy)
pnpm --filter @gocanto/writing build      # static build -> .vitepress/dist
pnpm --filter @gocanto/writing preview     # preview the built site on :4175
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
