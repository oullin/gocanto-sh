# gocanto-sh

Source for [gocanto.sh](https://gocanto.sh) — my personal profile site.

## Who

Gustavo "Gus" Ocanto — Software Engineer.

## What

A single-page profile site: who I am, what I've shipped, how to reach me. Not a blog, not a CMS. Also publishes machine-readable markdown bundles so LLM agents can read the same content without scraping.

## Why

- A corner of the internet I own, on my domain, with no platform in between.
- A sandbox for Vue 3 / Vite / Tailwind without work-codebase constraints.
- Public source so anyone evaluating me can read the code, not just the copy.

Fork it as a template if useful — swap out my name, content, and likeness before deploying.

## Domain map

`gocanto.sh` is the canonical production domain for this project.

Related Oullin domains live in separate deployment targets:

| Domain                                             | Deployment target           | Purpose                                                                                      |
| -------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------- |
| [`gocanto.sh`](https://gocanto.sh)                 | Vercel project `gocanto-sh` | Gustavo Ocanto's personal profile site.                                                      |
| [`writing.gocanto.sh`](https://writing.gocanto.sh) | Vercel project `gocanto-sh` | Long-form engineering writing. Source in [`workspace/writing`](workspace/writing/README.md). |
| [`ollin.sh`](https://ollin.sh)                     | Vercel project `ollin-sh`   | Short-domain redirect to [`oullin.io`](https://oullin.io).                                   |
| [`oullin.io`](https://oullin.io)                   | External site `oullin.io`   | Boutique software engineering and architecture consultancy.                                  |

Keep these projects separate. A deployment from the `ollin-sh` redirect repo must never target `gocanto-sh`.

## How

### Stack

Turborepo (pnpm) · Vue 3 + Vite 8 · TypeScript · Tailwind 4 · shadcn-vue components.

### Commands

```sh
pnpm install
pnpm dev
pnpm typecheck
pnpm build
```

`pnpm dev` serves the profile at `https://gocanto-sh.localhost:1355` and the writing site at `https://writing.gocanto-sh.localhost:1355` behind portless's shared HTTPS proxy. Portless sets up its local CA the first time it runs. To bypass the proxy, use `pnpm --filter @gocanto/app dev:app` on port 5173 or `pnpm --filter @gocanto/writing dev:site` on port 5175.

Formatting and linting run through the locally installed [`fmtkit`](https://github.com/oullin/fmtkit) binary (`brew tap oullin/fmtkit && brew install --cask fmtkit`) via `infra/scripts/fmtkit.sh`:

```sh
make format      # format changed files
make format-all  # format the whole repository
make lint        # check mode, no writes
```

### Vercel operations

**Vercel is the authoritative production target for `gocanto.sh` and `writing.gocanto.sh`.** Confirmed by response headers: `curl -sI https://gocanto.sh/` and `curl -sI https://writing.gocanto.sh/` both return `server: Vercel` and an `x-vercel-id` header. Production deploys for this repo should target the `oullin/gocanto-sh` Vercel project from this checkout:

```sh
npx vercel@latest deploy --prod --project gocanto-sh --scope oullin
```

After deployment, verify the custom domain and generated project aliases still point at the fresh `gocanto-sh` deployment:

```sh
npx vercel@latest alias list --scope oullin
curl -I https://gocanto.sh/
```

Expected production response for `https://gocanto.sh/` is `HTTP/2 200`.

#### Both domains, one project

`gocanto.sh` and `writing.gocanto.sh` are served by the single `gocanto-sh` project. `pnpm build:vercel` builds both sites and [`infra/scripts/assemble-dist.ts`](infra/scripts/assemble-dist.ts) mounts them side by side:

```
dist/
  app/      <- workspace/app/dist          -> gocanto.sh
  writing/  <- workspace/writing/.vitepress/dist -> writing.gocanto.sh
```

Neither site may sit at the `dist/` root. Vercel resolves the filesystem _before_ rewrites, so a root-level `/index.html` or `/assets/*` would be served on both hosts and shadow whichever site did not own it. With the root empty, the host rewrites in `vercel.json` always decide. The build fails if anything else appears at the root.

`vercel.json` then routes by `Host`:

- `writing(-preview)?\.gocanto\.sh/(.*)` rewrites to `/writing/$1`; everything else rewrites to `/app/$1`. The host values are regexes, so the one pattern covers production and the preview alias.
- `gocanto.sh/writing/*` permanently redirects to `writing.gocanto.sh/*`, so the writing site has one canonical origin. The bare `/writing/` needs its own rule: `/writing/:path*` matches `/writing` and `/writing/<slug>`, but not the trailing-slash form, which would otherwise serve the writing index from the profile origin.
- Security headers are per-host, and both hosts ship `script-src 'self'` with no `'unsafe-inline'`. VitePress emits its bootstrap as inline `<script>` blocks, so [`externalize-inline-scripts.ts`](workspace/writing/.vitepress/scripts/externalize-inline-scripts.ts) moves them into `assets/` after each build. Pinning CSP hashes instead would be a trap: one of those blocks carries `__VP_HASH_MAP__`, whose contents change whenever a post is added, so the hash would stop matching on the next publish. That pass fails the build if any inline script survives it, so a VitePress upgrade breaks the build rather than production.
- `cleanUrls` serves `posts/<slug>.md` at `/<slug>` without the `.html` suffix.

#### Previewing the writing site

A PR's own `gocanto-sh-git-<branch>-oullin.vercel.app` URL always serves the **profile** site: the host is not `writing.gocanto.sh`, so the writing rewrite misses and the catch-all sends everything to `/app/$1`. Browsing that deployment's `/writing/` does not help either — the filesystem answers with the writing HTML, but VitePress builds with `base: "/"`, so its `/assets/*`, `/favicon.png`, and internal links all fall through to `/app/*` and 404.

The writing side is therefore only viewable over a host that matches the writing rewrite. `writing-preview.gocanto.sh` is that host: in the Vercel project's Domains screen it must be set to **Connect to an environment → Preview → `<branch>`**, not _Redirect to Another Domain_ (a redirect just bounces to production and shows none of the branch's changes). Repoint it at whichever branch you are reviewing.

For local checks, `pnpm --filter @gocanto/writing dev:site` on port 5175 needs no Vercel at all.

#### GitHub Pages workflow (secondary/fallback, not production)

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) also builds `workspace/app/dist` and deploys it to GitHub Pages on every push to `main`. This is a fallback/mirror build check, not the production path — Vercel's git integration builds and deploys every push independently (visible as a "Vercel" check on PRs), and the `gocanto.sh` domain itself resolves to Vercel, not GitHub Pages. `vercel.json` carries the project's Vercel-specific config, including custom security headers.

If Vercel shows an Instant Rollback warning, do not deploy from another repository to clear it. Vercel disables auto-assignment of production domains after a rollback. Restore normal behaviour by promoting a good `gocanto-sh` deployment, or by freshly redeploying from this checkout and then promoting that fresh deployment:

```sh
npx vercel@latest promote <deployment-url> --scope oullin --yes
```

Verify aliases again after promotion.

### SEO & prerendering

Build-time prerender so crawlers and social scrapers get rendered HTML, not an empty SPA shell.

**In `<head>`** ([workspace/app/index.html](workspace/app/index.html)): canonical + `hreflang`, full Open Graph (`og:type=profile`, 1200×630 image), Twitter `summary_large_image`, `profile:*` tags, and a JSON-LD `@graph` connecting `ProfilePage`, `Person`, and `WebSite` (`sameAs` across X, GitHub, LinkedIn, YouTube, and Instagram).

The profile build emits five canonical HTML routes: `/`, `/resume`, and three expertise pages for regulated AI, banking-core modernisation, and payment systems. The public resume is HTML-only and derives from the curated store; the private source CV and its contact/reference details are never copied into build output.

**Static assets** in [workspace/app/public/](workspace/app/public/): `robots.txt`, `site.webmanifest`, `apple-touch-icon.png` (180×180), `og-image.png` (1200×630), recompressed `avatar.jpg`.

**Prerender flow** (follows [Vite's SSR guide](https://vite.dev/guide/ssr)):

1. `vite build` emits the client bundle with a loading shell.
2. `tsx scripts/prerender.ts` builds the SSR entry, renders every route in the typed page registry, and writes independently hydrated HTML files into `dist/`.
3. Client hydrates via `createSSRApp` in prod, `createApp` in dev.

`scripts/seo-guard.ts` rejects builds with duplicate page metadata, an incorrect H1/canonical count, missing JSON-LD, or private CV contact/reference content.

**SSR-safety:** components must not touch `window`/`document` at setup top-level. Use `onMounted`, event handlers, or a getter guard:

```ts
useEventListener(() => (typeof window === "undefined" ? null : window), "keydown", handler);
```

If a third-party component crashes during prerender, gate it behind an `onMounted`-toggled `v-if`.

### LLMs & machine-readable content

Built from [@gocanto/store](workspace/store/) by [workspace/llms/src/generate-markdown.ts](workspace/llms/src/generate-markdown.ts), emitted into `workspace/app/dist/` alongside the prerendered HTML. Every file is served as raw markdown/XML — no SPA fallback — so agents can `GET` directly. Confirmed in production: `curl -sI https://gocanto.sh/profile.md` returns `content-type: text/markdown; charset=utf-8` (served by Vercel, not re-wrapped in HTML):

- [`llms.txt`](https://gocanto.sh/llms.txt) — index
- [`index.md`](https://gocanto.sh/index.md) — full profile in one file
- [`bio.md`](https://gocanto.sh/bio.md) — short biography
- [`profile.md`](https://gocanto.sh/profile.md) · [`experience.md`](https://gocanto.sh/experience.md) · [`projects.md`](https://gocanto.sh/projects.md) · [`education.md`](https://gocanto.sh/education.md) · [`talks.md`](https://gocanto.sh/talks.md) · [`recommendations.md`](https://gocanto.sh/recommendations.md) · [`links.md`](https://gocanto.sh/links.md)
- [`sitemap.xml`](https://gocanto.sh/sitemap.xml) — the canonical HTML URL with `lastmod` from the latest profile, experience, project, talk, or recommendation update

Raw Markdown and `llms.txt` remain public for agents but are excluded from search sitemaps and served with `X-Robots-Tag: noindex, follow`. The writing host owns its article Markdown and [`llms.txt`](https://writing.gocanto.sh/llms.txt); the profile index links there rather than duplicating article bodies.

## License

[MIT](./LICENSE) for the code. Personal content (copy, images, name, likeness) is **not** covered — don't reuse those when forking.
