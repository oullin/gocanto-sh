---
title: Building the first Oullin site and blog engine
date: 2025-10-15
updated: 2026-07-27
description: "A retrospective on the original Go, Vue, PostgreSQL, Docker, and Caddy stack that powered Oullin before its writing moved to Gocanto."
tags: [architecture, go, vue]
---

The first Oullin site was a personal site and publishing system built from a Go API, a Vue
single-page application, PostgreSQL, Docker Compose, and Caddy. This article records that
2025 architecture. It is not a description of the current Oullin site or the current writing
pipeline.

I built it to own the whole path from Markdown to database row to rendered page. That was
useful for learning and for understanding failures across the boundary between the browser,
proxy, application, and storage. It was also more system than a personal blog needed.

## The original request path

```text
browser
  -> public Caddy
  -> Vue application or /api route
  -> Go API
  -> PostgreSQL
```

Caddy terminated TLS, served frontend assets, and proxied API requests. The Go service owned
posts, tags, profile data, and a small publishing interface. PostgreSQL stored the canonical
content and metadata.

Local and production deployments used Docker Compose. The files were not identical, but the
service boundaries were close enough that networking, health checks, and storage paths could
be exercised before deployment.

## Publishing was a coordinated operation

The source post began as Markdown with frontmatter. Publishing then crossed several systems:

1. parse and validate the post;
2. write the content and metadata;
3. regenerate crawler-facing HTML and structured data;
4. build the Vue assets;
5. deploy the API and web containers;
6. verify the human and crawler routes.

The static SEO generator existed because the SPA's browser-rendered content was not a
dependable input for link previews and crawlers. That implementation is documented in
[Shipping SEO for a single-page app](/shipping-seo-for-a-single-page-app-the-pragmatic-way).

It worked, but it created two delivery products: the SPA for people and generated pages for
crawlers. Every title, canonical URL, and post route had to agree across them.

## Caddy made the boundaries visible

The production edge was deliberately small:

```text
oullin.io {
    encode zstd gzip

    handle_path /api/* {
        reverse_proxy api:8080
    }

    handle {
        root * /srv/web
        try_files {path} /index.html
        file_server
    }
}
```

The real configuration accumulated more rules for assets, bots, internal relay paths,
security headers, and mutual TLS. That growth produced useful debugging lessons, including
the SNI and path-rewrite incident described in
[Debugging a multi-layered Docker and Caddy deployment](/debugging-multi-layered-docker-deployment).

## What the first stack taught me

Owning each layer made failures explainable. I could follow a request through DNS, TLS,
Caddy handlers, the Go route, and the database without treating any part as a managed black
box.

It also clarified where custom infrastructure stopped paying for itself:

- a content database added migrations and backup responsibilities to Markdown;
- a separate crawler rendering path could drift from the reader path;
- two Compose projects and two Caddy layers made one protected endpoint expensive to reason
  about;
- publishing required a deployment instead of a static-site build.

The current arrangement is simpler. Oullin is a consultancy site. Long-form writing lives in
this VitePress package, where each Markdown file produces the article, metadata, RSS entry,
sitemap entry, search document, and raw Markdown resource in one build.

The first stack was not wasted work. It produced several reusable Go and infrastructure
projects and made the simplification evidence-based. Its most useful outcome was learning
which parts of owning the wheel were about the product and which were maintenance for its own
sake.

The historical repositories remain available at
[`oullin/api`](https://github.com/oullin/api),
[`oullin/web`](https://github.com/oullin/web), and
[`oullin/infra`](https://github.com/oullin/infra).
