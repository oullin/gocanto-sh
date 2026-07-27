---
title: Shipping SEO for a single-page app, the pragmatic way
date: 2025-09-25
updated: 2026-07-27
description: "A retrospective on the build-time SEO generator used by the first Oullin SPA: static crawler pages, structured data, social metadata, and a deliberately small runtime."
tags: [seo, static-generation, go]
---

In September 2025 the first Oullin site was a Vue single-page application backed by a Go
API. It worked for readers after JavaScript loaded, but link-preview clients and some crawlers
needed useful HTML in the initial response.

The implementation in [`oullin/api` PR 110](https://github.com/oullin/api/pull/110) generated
static crawler pages during deployment instead of adding a server-side JavaScript runtime.
Related web changes landed in
[`oullin/web` PR 64](https://github.com/oullin/web/pull/64).

This is a historical account. Oullin and Gocanto now use different publishing paths.

## Generate from the same content contracts

The Go CLI assembled profile, project, talk, category, and post data through the same handler
contracts used by the API. It then rendered an embedded HTML template containing:

- a readable title and summary;
- one canonical URL;
- Open Graph and X card metadata;
- JSON-LD describing the page;
- the relevant content for a crawler or preview client.

The output was written into the frontend artifact. Caddy selected it for known crawler user
agents while normal browser traffic received the SPA.

The useful design choice was reuse. A second set of handwritten SEO fixtures would have
created another content source. Reusing application contracts kept the generated page tied
to the data the reader-facing application used.

## Keep generation out of the request path

The generator ran as a CLI task. Production requests did not start an application renderer
or call the API to build metadata on demand.

That made the serving path cheap and cacheable, but it moved freshness into deployment. A
content change did not exist publicly until the generator and frontend were rebuilt
together. The build therefore had to fail when required metadata or output paths were
missing.

Configuration named the public origin and the output directory explicitly. Absolute
canonical and social URLs should never depend on the build machine's hostname.

## The trade-off was two representations

The SPA and crawler HTML represented the same page through different artifacts. That creates
several obligations:

- route coverage must match;
- canonical URLs must be identical;
- titles and descriptions must come from one source;
- generated files must be refreshed on every relevant content change;
- bot detection must not become a cloaking mechanism that shows materially different
  information.

Those obligations were acceptable for the original system, but they were not free. They are
why the current Gocanto writing site uses static generation for the reader page itself. One
VitePress build now produces the article HTML, structured metadata, sitemap, RSS, search
index, and raw Markdown.

## What remains pragmatic

The general lesson is not that every SPA should add a crawler branch. It is to choose the
smallest rendering path that gives readers and machines the same meaningful content.

For an existing SPA with a stable deployment pipeline, build-time HTML can be a lower-risk
bridge than adding runtime SSR. For a content-heavy site starting fresh, generating the
actual reader pages ahead of time is usually simpler because there is only one representation
to keep correct.
