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

### SEO & prerendering

Build-time prerender so crawlers and social scrapers get rendered HTML, not an empty SPA shell.

**In `<head>`** ([workspace/app/index.html](workspace/app/index.html)): canonical + `hreflang`, full Open Graph (`og:type=profile`, 1200×630 image), Twitter `summary_large_image`, `profile:*` tags, JSON-LD `@graph` with `Person` + `WebSite` (`sameAs` across X, GitHub, LinkedIn, YouTube, Instagram).

**Static assets** in [workspace/app/public/](workspace/app/public/): `robots.txt`, `site.webmanifest`, `apple-touch-icon.png` (180×180), `og-image.png` (1200×630), recompressed `avatar.jpg`.

**Prerender flow** (follows [Vite's SSR guide](https://vite.dev/guide/ssr)):

1. `vite build` emits the client bundle with a loading shell.
2. `node scripts/prerender.mjs` builds the SSR entry, calls `renderToString(createSSRApp(App))`, and injects the result into `dist/index.html`.
3. Client hydrates via `createSSRApp` in prod, `createApp` in dev.

**SSR-safety:** components must not touch `window`/`document` at setup top-level. Use `onMounted`, event handlers, or a getter guard:

```ts
useEventListener(
    () => (typeof window === "undefined" ? null : window),
    "keydown",
    handler,
);
```

If a third-party component crashes during prerender, gate it behind an `onMounted`-toggled `v-if`.

### LLMs & machine-readable content

Built from [@gocanto/store](workspace/store/) by [workspace/llms/src/generate-markdown.ts](workspace/llms/src/generate-markdown.ts), emitted into `workspace/app/dist/` alongside the prerendered HTML. Every file is served as raw markdown/XML — no SPA fallback — so agents can `GET` directly:

- [`llms.txt`](https://gocanto.sh/llms.txt) — index
- [`index.md`](https://gocanto.sh/index.md) — full profile in one file
- [`profile.md`](https://gocanto.sh/profile.md) · [`experience.md`](https://gocanto.sh/experience.md) · [`projects.md`](https://gocanto.sh/projects.md) · [`education.md`](https://gocanto.sh/education.md) · [`talks.md`](https://gocanto.sh/talks.md) · [`recommendations.md`](https://gocanto.sh/recommendations.md) · [`links.md`](https://gocanto.sh/links.md)
- [`sitemap.xml`](https://gocanto.sh/sitemap.xml) — 10 URLs with `lastmod` from latest content update

## License

[MIT](./LICENSE) for the code. Personal content (copy, images, name, likeness) is **not** covered — don't reuse those when forking.
