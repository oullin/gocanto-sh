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

| Domain                                             | Deployment target                   | Purpose                                                                                      |
| -------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------- |
| [`gocanto.sh`](https://gocanto.sh)                 | Vercel project `gocanto-sh`         | Gustavo Ocanto's personal profile site.                                                      |
| [`writing.gocanto.sh`](https://writing.gocanto.sh) | Separate Vercel project (VitePress) | Long-form engineering writing. Source in [`workspace/writing`](workspace/writing/README.md). |
| [`ollin.sh`](https://ollin.sh)                     | Vercel project `ollin-sh`           | Short-domain redirect to [`oullin.io`](https://oullin.io).                                   |
| [`oullin.io`](https://oullin.io)                   | External site `oullin.io`           | Boutique software engineering and architecture consultancy.                                  |

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

Local formatting uses Docker Compose to run the upstream [`go-fmt`](https://github.com/oullin/go-fmt) support formatter for TypeScript/Vue files:

```sh
make format
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

`writing.gocanto.sh` (the VitePress site in [`workspace/writing`](workspace/writing/README.md)) deploys as its own, separate Vercel project — confirmed by the same `server: Vercel` / `x-vercel-id` header evidence above. It is not built or served by this repo's Vercel project or by `pages.yml`.

#### GitHub Pages workflow (secondary/fallback, not production)

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) also builds `workspace/app/dist` and deploys it to GitHub Pages on every push to `main`. This is a fallback/mirror build check, not the production path — Vercel's git integration builds and deploys every push independently (visible as a "Vercel" check on PRs), and the `gocanto.sh` domain itself resolves to Vercel, not GitHub Pages. `vercel.json` carries the project's Vercel-specific config, including custom security headers.

If Vercel shows an Instant Rollback warning, do not deploy from another repository to clear it. Vercel disables auto-assignment of production domains after a rollback. Restore normal behaviour by promoting a good `gocanto-sh` deployment, or by freshly redeploying from this checkout and then promoting that fresh deployment:

```sh
npx vercel@latest promote <deployment-url> --scope oullin --yes
```

Verify aliases again after promotion.

### SEO & prerendering

Build-time prerender so crawlers and social scrapers get rendered HTML, not an empty SPA shell.

**In `<head>`** ([workspace/app/index.html](workspace/app/index.html)): canonical + `hreflang`, full Open Graph (`og:type=profile`, 1200×630 image), Twitter `summary_large_image`, `profile:*` tags, JSON-LD `@graph` with `Person` + `WebSite` (`sameAs` across X, GitHub, LinkedIn, YouTube, Instagram).

**Static assets** in [workspace/app/public/](workspace/app/public/): `robots.txt`, `site.webmanifest`, `apple-touch-icon.png` (180×180), `og-image.png` (1200×630), recompressed `avatar.jpg`.

**Prerender flow** (follows [Vite's SSR guide](https://vite.dev/guide/ssr)):

1. `vite build` emits the client bundle with a loading shell.
2. `tsx scripts/prerender.ts` builds the SSR entry, calls `renderToString(createSSRApp(App))`, and injects the result into `dist/index.html`.
3. Client hydrates via `createSSRApp` in prod, `createApp` in dev.

**SSR-safety:** components must not touch `window`/`document` at setup top-level. Use `onMounted`, event handlers, or a getter guard:

```ts
useEventListener(() => (typeof window === "undefined" ? null : window), "keydown", handler);
```

If a third-party component crashes during prerender, gate it behind an `onMounted`-toggled `v-if`.

### LLMs & machine-readable content

Built from [@gocanto/store](workspace/store/) by [workspace/llms/src/generate-markdown.ts](workspace/llms/src/generate-markdown.ts), emitted into `workspace/app/dist/` alongside the prerendered HTML. Every file is served as raw markdown/XML — no SPA fallback — so agents can `GET` directly. Confirmed in production: `curl -sI https://gocanto.sh/profile.md` returns `content-type: text/markdown; charset=utf-8` (served by Vercel, not re-wrapped in HTML):

- [`llms.txt`](https://gocanto.sh/llms.txt) — index
- [`index.md`](https://gocanto.sh/index.md) — full profile in one file
- [`profile.md`](https://gocanto.sh/profile.md) · [`experience.md`](https://gocanto.sh/experience.md) · [`projects.md`](https://gocanto.sh/projects.md) · [`education.md`](https://gocanto.sh/education.md) · [`talks.md`](https://gocanto.sh/talks.md) · [`recommendations.md`](https://gocanto.sh/recommendations.md) · [`links.md`](https://gocanto.sh/links.md)
- [`sitemap.xml`](https://gocanto.sh/sitemap.xml) — 10 URLs with `lastmod` from latest content update

## License

[MIT](./LICENSE) for the code. Personal content (copy, images, name, likeness) is **not** covered — don't reuse those when forking.
