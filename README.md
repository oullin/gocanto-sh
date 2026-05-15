# gocanto-sh

Personal profile site for Gustavo "Gus" Ocanto — the source behind [gocanto.sh](https://gocanto.sh).

## What this is

A small, fast, statically-buildable site that doubles as my online business card: who I am, what I work on, things I've shipped, and how to reach me. It's a single-page profile, not a blog engine or a CMS — just a curated home on the web.

## Why I care

- I want a corner of the internet I fully own, on my domain, without a platform between me and the people reading it.
- It's a sandbox where I can keep my Vue 3 / Vite / Tailwind muscles warm and try ideas without the constraints of a work codebase.
- The repo is public so anyone considering working with me can read the code, not just the marketing copy on top of it.

## Who this is for

- **Recruiters, collaborators, and clients** who want a quick, honest read on what I do.
- **Other developers** who'd like a minimal Turborepo + Vue 3 + Tailwind 4 starting point and prefer to learn by reading a real, small project rather than a tutorial.
- **Me** — as a long-term home for my professional identity that I can keep iterating on.

You're welcome to fork it as a template for your own profile site. Please swap out my name, content, and likeness before deploying.

## Stack

- Turborepo (pnpm workspace)
- Vue 3 + Vite 8
- TypeScript
- Tailwind CSS 4
- shadcn-vue style components

## Commands

```sh
pnpm install
pnpm dev
pnpm typecheck
pnpm build
```

## SEO & prerendering

The site ships with a complete SEO baseline and a build-time prerender step so crawlers and social scrapers see fully rendered HTML, not an empty SPA shell.

### What's in the head

- Canonical URL + `hreflang` alternates
- Full Open Graph set (`og:type=profile`, `og:url`, `og:site_name`, `og:locale`, `og:image` 1200×630 with width/height)
- Twitter card (`summary_large_image`) with `twitter:title`, `twitter:description`, `twitter:creator`, `twitter:site`
- `profile:first_name` / `last_name` / `username`
- JSON-LD `@graph` with `Person` + `WebSite` (jobTitle, worksFor, sameAs across X, GitHub, LinkedIn, YouTube, Instagram)

Live in [workspace/app/index.html](workspace/app/index.html).

### Static SEO assets

Under [workspace/app/public/](workspace/app/public/):

- `robots.txt` — allow all + sitemap pointer
- `sitemap.xml` — single URL with `lastmod`
- `site.webmanifest` — PWA manifest (name, icons, theme color)
- `apple-touch-icon.png` (180×180) — generated from `avatar.jpg` via `sips`
- `og-image.png` (1200×630) — landscape OG card derived from `avatar.jpg`
- `avatar.jpg` — re-compressed at quality 75 (378 KB → 116 KB)

### Build-time prerender (native Vite SSR)

The single-route app is prerendered at build time so `dist/index.html` ships ~200 KiB of rendered HTML — boosting first paint, crawl coverage, and social-preview reliability.

Flow:

1. `vite build` — client bundle, emits `dist/index.html` with `<div id="app">` containing the loading shell.
2. `node scripts/prerender.mjs` — builds the SSR entry (`src/entry-server.ts`), imports it, calls `renderToString(createSSRApp(App))`, and regex-injects the result into `dist/index.html`. Temp SSR dir is cleaned up.
3. On the client, [src/main.ts](workspace/app/src/main.ts) uses `createSSRApp` in production to hydrate the prerendered DOM (no flicker) and `createApp` in dev for plain CSR.

Pattern follows [Vite's SSR guide](https://vite.dev/guide/ssr).

### SSR-safety constraint

Because the prerender renders in Node, components must not touch `window` / `document` at setup top-level. Use callbacks (`onMounted`, event handlers, `watch`) or guard with a getter:

```ts
// safe — @vueuse no-ops when the target getter returns null on the server
useEventListener(
    () => (typeof window === "undefined" ? null : window),
    "keydown",
    handler,
);
```

If a third-party component crashes during prerender, wrap it with an `onMounted`-toggled `v-if` rather than calling browser APIs at setup.

## License

Released under the [MIT License](./LICENSE). The code is free to use, modify, and redistribute under those terms. Personal content (copy, images, name, likeness) is **not** covered by the license — please don't reuse those parts when forking.
