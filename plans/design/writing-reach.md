# Writing reach design spike

Plan 012 design deliverable. This document records evidence from detached commit
`f126e77a5a325e73cbb059892a2dfddcb92b3557` on 2026-07-20. It proposes follow-up
work; it does not change production code or deployment configuration.

## 1. Current outputs and constraints

### Drift check

The required drift check was run before the build:

```sh
git diff --stat 7e1c691..HEAD -- \
  workspace/writing workspace/llms/src \
  workspace/app/src/components/GlobalSearch.vue
```

There is content drift, including the reconciled `BioFormatter` work and writing
site changes, but `git diff --name-status` reports no moved or deleted scoped
files. The structural-drift STOP condition therefore did not apply.

### Build observed on this spike

`pnpm --filter @gocanto/writing build` completed successfully with VitePress
1.6.4 in 1.59 seconds. It rendered pages and reported `generating sitemap`.
There are 34 generated files in `workspace/writing/.vitepress/dist`:

- Top level: `404.html`, `avatar-128.jpg`, `favicon.png`, `feed.rss`,
  `hashmap.json`, `index.html`, `og-image.png`, `signed-webhooks.html`,
  `sitemap.xml`, and `vp-icons.css`.
- Page/application assets: `assets/app.C6K43Z8o.js`,
  `assets/index.md.D-z4WLeD.js`, `assets/index.md.D-z4WLeD.lean.js`,
  `assets/signed-webhooks.md.C9cqqdCS.js`,
  `assets/signed-webhooks.md.C9cqqdCS.lean.js`, and
  `assets/style.BQNMe8Qc.css`.
- Search/framework chunks: `assets/chunks/@localSearchIndexroot.DMdYVT75.js`,
  `assets/chunks/VPLocalSearchBox.Cm-n2CJI.js`,
  `assets/chunks/framework.DC4s_2cg.js`, and
  `assets/chunks/theme.R2Dr4CFh.js`.
- Font assets: `assets/inter-italic-cyrillic-ext.r48I6akx.woff2`,
  `assets/inter-italic-cyrillic.By2_1cv3.woff2`,
  `assets/inter-italic-greek-ext.1u6EdAuj.woff2`,
  `assets/inter-italic-greek.DJ8dCoTZ.woff2`,
  `assets/inter-italic-latin-ext.CN1xVJS-.woff2`,
  `assets/inter-italic-latin.C2AdPX0b.woff2`,
  `assets/inter-italic-vietnamese.BSbpV94h.woff2`,
  `assets/inter-roman-cyrillic-ext.BBPuwvHQ.woff2`,
  `assets/inter-roman-cyrillic.C5lxZ8CY.woff2`,
  `assets/inter-roman-greek-ext.CqjqNYQ-.woff2`,
  `assets/inter-roman-greek.BBVDIX6e.woff2`,
  `assets/inter-roman-latin-ext.4ZJIpNVo.woff2`,
  `assets/inter-roman-latin.Di8DUHzh.woff2`, and
  `assets/inter-roman-vietnamese.BjW4sHH5.woff2`.

The generated `sitemap.xml` contains exactly the writing homepage and the clean
post URL:

```text
https://writing.gocanto.sh/
https://writing.gocanto.sh/signed-webhooks
```

The generated `feed.rss` contains one item, `Signed webhooks done right`, at
`https://writing.gocanto.sh/signed-webhooks`. No `llms.txt`, raw
`signed-webhooks.md`, or `search-index.json` is emitted. The generated directory
is ignored by `.gitignore`'s `dist/` rule, and `git status` remained clean after
the build.

### Source evidence and operational boundary

- `workspace/writing/posts.data.ts` uses
  `createContentLoader("posts/*.md")`, includes source markdown, normalizes the
  clean post URL, and produces title, URL, date variants, reading time,
  description, and tags. There is currently one source post:
  `workspace/writing/posts/signed-webhooks.md`.
- `workspace/writing/.vitepress/config.ts` rewrites `posts/:slug.md` to
  `:slug.md`, enables VitePress's local search and sitemap with hostname
  `https://writing.gocanto.sh`, and calls `writeRssFeed(siteConfig.outDir)` from
  `buildEnd`.
- `workspace/writing/.vitepress/rss.ts` proves that a build-end artifact writer
  can load the same post data and write into the final output directory.
- `workspace/llms/src/llms-txt.ts` hardcodes the main site's section links.
  `workspace/llms/src/sitemap.ts` hardcodes the main host's machine-readable
  pages. `workspace/llms/src/generate-markdown.ts` now emits nine markdown files,
  including `bio.md` through the class-based
  `workspace/llms/src/bio-formatter.ts` `BioFormatter`, plus `llms.txt` and the
  main sitemap.
- `workspace/app/src/components/GlobalSearch.vue` lazily imports the
  recommendations fixture when the palette opens, builds the seven-kind corpus,
  and sends every selected result to `SearchResultDetail`. The types and builders
  in `workspace/domain/src/search.ts` model only those seven internal,
  Sheet-backed result kinds.
- The root `README.md` and `workspace/writing/README.md` establish that
  `gocanto.sh` and `writing.gocanto.sh` are separate Vercel projects. The writing
  project currently keeps the repository as its Root Directory and sets its
  build/output values in that project's Vercel dashboard. One build cannot place
  files in the other deployment, so federation must cross an HTTP boundary.

## 2. Machine-readable writing layer

### 2.1 Emit a writing `llms.txt` and raw markdown per post

**Recommendation: yes. Generate both from a class-based `WritingBundle` during
the writing build's `buildEnd` hook.** Emit `/llms.txt` and one raw file at the
same clean stem as each HTML page, for example `/signed-webhooks.md`. The raw file
should preserve the canonical source markdown and frontmatter, normalized only
to UTF-8 and one trailing newline. `llms.txt` should list each post's title,
description, date, tags, HTML URL, and raw-markdown URL; it should not inline all
post bodies.

This closes the observed gap—neither file exists in `dist`—without introducing a
second source of truth. `posts.data.ts` already asks VitePress for source text,
and `rss.ts` demonstrates the correct lifecycle and output directory. A
`public/` copy would duplicate or require moving authored posts and would not
validate the index against post metadata, whereas a hook can derive every output
from the same loaded post set.

Plan 010's `MarkdownBundle` is being built in parallel. The follow-up must wait
for its public contract to settle and make `WritingBundle` mirror that shape
(same bundle-entry abstraction, rendering/writing split, deterministic ordering,
newline rules, and error policy) rather than invent a competing API now. The
writing-specific class owns only conversion from loaded posts to bundle entries.
A representative responsibility split is:

```text
WritingPostLoader -> WritingBundle -> BundleFile[] -> bundle writer -> outDir
                  -> WritingSearchIndex -----------^ (separate JSON artifact)
```

- `WritingPostLoader` is the class-based adapter around VitePress content data.
  The framework-required default export or hook callback may remain a thin
  standalone boundary.
- `WritingBundle` validates unique, safe slugs and absolute canonical URLs,
  renders `llms.txt`, and supplies raw-markdown bundle entries.
- The plan-010 writer abstraction performs filesystem writes. If plan 010 does
  not expose a writer, add a small class rather than putting write loops in
  `config.ts`.

Failures must fail the build: a post with an unsafe/duplicate slug, missing title
or description, invalid date, or unwritable artifact is a broken bundle, not an
optional enhancement. Unit tests should cover deterministic ordering, URL and
path mapping, source preservation, final newlines, and rejection of unsafe or
duplicate output paths. An integration assertion should inspect the build output
for `llms.txt` plus one `.md` per published post.

### 2.2 Link the writing bundle from `gocanto.sh/llms.txt`

**Recommendation: add one federated `Writing` section linking to
`https://writing.gocanto.sh/llms.txt`; do not copy post links or bodies into the
main bundle.** The main generator should use the plan-010 `MarkdownBundle` shape,
or its class-based formatter, to add this stable external index URL instead of
teaching the main build about writing posts.

This changes the hardcoded output in `workspace/llms/src/llms-txt.ts` by one
stable link and respects the deployment boundary documented in both READMEs.
Writing deploys can add, edit, or remove posts without requiring a profile-site
deployment. A broken or stale writing deployment is isolated; the main profile
bundle remains complete for its existing scope.

Do not add individual posts to `gocanto.sh/index.md` by default. That would be
duplication rather than federation and would couple the main bundle's freshness
to the other project's content. The owner can explicitly choose a curated
cross-site list later.

### 2.3 Keep sitemaps per host

**Recommendation: do not add writing URLs to `gocanto.sh/sitemap.xml`. Keep the
two sitemaps separate and retain the already-emitted writing sitemap as the
canonical inventory for writing HTML pages.** Ensure each host advertises its own
sitemap through its own `robots.txt` or Search Console setup. Do not add raw `.md`
or `llms.txt` URLs to the writing HTML sitemap by default; the bundle index is
their discovery mechanism and the HTML page remains the canonical search result.

The local build proves that VitePress already emits
`workspace/writing/.vitepress/dist/sitemap.xml` with the correct writing host and
both current HTML URLs. The base
[Sitemaps protocol](https://www.sitemaps.org/protocol.html) expects one host per
sitemap and treats cross-host submission as an ownership case. Google does allow
a sitemap to cover multiple verified sites, but requires ownership verification
and submission through Search Console, or per-site sitemaps authorized through
each site's `robots.txt`; see
[Google's cross-site sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#cross-site-sitemaps).
Both hosts are controlled here, so cross-submission is technically possible, but
it adds verification and operational coupling without improving the already
correct per-host output.

## 3. Cross-site search

### 3.1 Emit a build-time `search-index.json`

**Recommendation: emit a deterministic, versioned JSON document from the writing
build.** Use a class-based `WritingSearchIndex` fed by the same normalized post
records as `WritingBundle`. Its public schema should be intentionally smaller
than the internal `Post` type:

```json
{
  "version": 1,
  "posts": [
    {
      "title": "Signed webhooks done right",
      "url": "https://writing.gocanto.sh/signed-webhooks",
      "description": "Most webhook security is a shared secret and a prayer…",
      "tags": ["webhooks", "security", "cloudflare", "hmac"],
      "date": "2026-07-18"
    }
  ]
}
```

Use absolute HTTPS URLs because the consumer is another origin. Keep `date` as
canonical `YYYY-MM-DD`, omit presentation-only `display`, `short`, `year`, and
`readingTime`, sort newest first with URL as a deterministic tie-breaker, and do
not include a volatile `generatedAt` that changes bytes without a content change.
Validate the serialized object in both producer and consumer tests. This is
essentially the stable search subset of the `Post[]` that `posts.data.ts` already
builds, and it fills the observed absence of `search-index.json` without scraping
the VitePress local-search chunk.

### 3.2 Fetch lazily from the app

**Recommendation: fetch
`https://writing.gocanto.sh/search-index.json` when GlobalSearch first opens,
coalescing concurrent opens and caching a successful result for the page
session.** A class-based `WritingSearchClient` should own fetch, timeout/abort,
schema validation, and conversion into domain search results. Use a simple
credential-free `GET` with `Accept: application/json`.

Match the existing lazy behavior in
`workspace/app/src/components/GlobalSearch.vue`: local fixtures remain available
immediately, and the remote group appears when ready. Preserve plan 007's
failure/retry contract:

- A network, non-2xx, timeout, or schema error affects only Writing; the seven
  local kinds continue to work and no unhandled rejection escapes.
- Track explicit `idle`, `loading`, `ready`, and `error` states. Coalesce one
  in-flight request rather than issuing one per reactive update.
- Clear the in-flight promise on failure and retry on the next palette open (and
  from an explicit retry affordance if one is shown). Do not tight-loop retries.
- Cache only a validated success for the current page session. Do not persist it
  in local storage; normal HTTP caching can reuse bytes across sessions.

Index staleness is acceptable: the producer updates on each writing deploy, and
the app reads whatever version is currently live. The two deployments do not need
to coordinate at build time. A future incompatible schema must use a new
`version`; the consumer should reject unsupported versions without affecting
local search.

There is one post today, below the plan's approximately five-post usefulness
threshold. Build the index with the machine-readable layer because its marginal
cost is small, but defer or feature-gate the app integration until five posts
exist unless the owner explicitly values cross-site search now. Re-evaluate using
observed palette usage and post count rather than deleting the architecture.

### 3.3 Add a distinct Writing result action

**Recommendation: add `writing` as an eighth visible kind, but model selection as
a discriminated action instead of forcing a post through the Sheet payload.** For
example, internal results carry a `detail` action and writing results carry an
`external` action with the absolute post URL. This makes
`GlobalSearch.vue` route internal selections to `SearchResultDetail` and writing
selections to navigation. It also prevents `SearchResultDetail` from gaining an
empty or artificial Writing payload.

Render a document/external-link icon, title, and enough secondary context to make
the destination clear. Mark the group as `Writing`. The default recommendation
is same-tab navigation to the canonical post, with the palette closed before
navigation; it behaves like normal search selection and avoids surprising popup
behavior. If the owner chooses a new tab, render a real anchor with
`target="_blank"` and `rel="noopener noreferrer"` so keyboard and assistive
technology semantics remain correct.

This is a deliberate divergence from the current universal Sheet path in
`workspace/app/src/components/GlobalSearch.vue` and the current
`SearchPayload`/`SearchResult` contract in `workspace/domain/src/search.ts`.
Tests should cover filtering by the new chip, remote results arriving after local
ones, both selection branches, keyboard activation, failure isolation, and retry
after reopening.

### 3.4 Serve the index with CORS

**Recommendation: serve only `/search-index.json` with
`Access-Control-Allow-Origin: *`.** The index is intentionally public, carries no
credentials, and wildcard access supports production, preview, and local app
origins without a growing allowlist. Keep the request credential-free. An exact
`https://gocanto.sh` value is acceptable if the owner wants the narrowest policy,
but then previews and local development need their own proxy or environment-aware
allowlist.

Under the deployment findings in the root and writing READMEs, this is a setting
of the separate writing Vercel deployment, not `pages.yml` and not the app's
runtime. Vercel documents custom static response headers in a project's
[`vercel.json` `headers` configuration](https://vercel.com/docs/project-configuration/vercel-json#headers).
Because the writing project currently uses repository root `./`, its file-based
configuration is the root `vercel.json`; add an exact `/search-index.json` rule
there and verify it on the writing production and preview deployments. The rule
will also be parsed for the main project under today's shared root, but that
project has no such artifact, so the narrow path does not expose another
resource. Do not place a second `vercel.json` under `workspace/writing` unless the
writing project's Root Directory is deliberately changed; Vercel resolves the
configuration from the selected project root. Vercel's
[monorepo guidance](https://vercel.com/docs/monorepos) confirms that root
directory is a per-project deployment setting.

Also set/verify `Content-Type: application/json; charset=utf-8` and a revalidation
cache policy. Deployment acceptance must use response headers from the writing
custom domain and at least one preview URL, followed by an actual browser-origin
fetch from the app; file existence alone does not prove CORS behavior.

## 4. Follow-up plans, sequence, and owner questions

### Recommended follow-up plan outlines

1. **Writing machine-readable artifacts — M.** Depends on plan 010's
   `MarkdownBundle` contract. Add class-based `WritingPostLoader`,
   `WritingBundle`, and `WritingSearchIndex`; connect them through the VitePress
   build-end boundary; emit `llms.txt`, one raw `.md` per post, and the versioned
   JSON index. Add unit/build-output tests and the exact-path Vercel CORS/cache
   header. Verify production MIME types, CORS, sitemap preservation, and that
   malformed metadata fails the build.
2. **Federate the main LLM index — S.** Depends on follow-up 1 being deployed so
   the link is not dead, and on plan 010. Add one Writing section to the main
   `llms.txt`, update its tests, and verify the link resolves to a writing-owned
   index. Do not change the main sitemap or duplicate posts.
3. **Federated Writing results in GlobalSearch — M.** Depends on follow-up 1's
   deployed, versioned index. Prefer scheduling at five published posts, or
   feature-gate until then. Add the class-based remote client, eighth corpus kind,
   discriminated detail/external action, lazy failure/retry state, accessible UI,
   and component/browser tests for fetch success, CORS, failure isolation,
   retry, filtering, and navigation.

Dependency order is `plan 010 -> follow-up 1 -> follow-up 2`, with follow-up 3
also depending on follow-up 1 but otherwise able to proceed independently of
follow-up 2.

### Open questions only the owner can answer

1. Should `gocanto.sh/index.md` remain profile-only as recommended, or should it
   include a curated writing list in addition to the federated `llms.txt` link?
2. Should selecting a Writing search result navigate in the same tab as
   recommended, or open a new tab?
3. With only one post today, should the app search integration wait until roughly
   five posts, or is a single unified palette strategically valuable now?
4. Is public wildcard CORS acceptable for intentionally public search metadata,
   or does the owner prefer production-only `https://gocanto.sh` despite added
   preview/local-development handling?

## Risks and rejected alternatives

- **Parallel contract risk:** plan 010 may rename or reshape the shared bundle
  abstractions. Sequence after it and mirror the merged API; do not fork a second
  convention.
- **Shared-root deployment risk:** the exact CORS header rule lives in the root
  Vercel config under today's project settings. Verify both projects after the
  change, even though the path exists only in writing.
- **Cross-deploy compatibility risk:** a writing index can deploy before an app
  consumer or vice versa. A versioned, additive schema plus failure isolation
  keeps this safe.
- **Small-corpus value risk:** one remote post may not justify UI and test
  complexity. Emitting the index now preserves the option while deferring the UI
  avoids premature surface area.
- **Duplicate-content risk:** copying post bodies into the main bundle or listing
  raw markdown in the HTML sitemap would create competing discovery paths. The
  recommended federation keeps HTML canonical and raw markdown agent-oriented.
- **Runtime dependency risk:** the app becomes partially dependent on another
  origin. A timeout, isolated state, cached validated success, and retry-on-reopen
  keep local search available.

Rejected alternatives are copying source posts into `public/`, fetching writing
content during the main app build, scraping VitePress's hashed local-search
chunk, merging hosts into the main sitemap, and routing writing results through
the internal detail Sheet. Each either duplicates content, couples independent
deployments, depends on an unstable implementation artifact, adds unnecessary
verification, or misrepresents the result behavior.

## Post-delivery addendum (2026-07-20, review finding)

Vercel root-directory caveat: if the writing project's Root Directory were ever
set to the repository root (`./`), it would inherit the root `vercel.json` —
including the ENFORCING `Content-Security-Policy` whose script hash is
generated for the main app's inline scripts — and the VitePress site's own
inline scripts would be blocked. Verified 2026-07-20: `writing.gocanto.sh`
serves none of the root headers, so its project root is `workspace/writing`
and no inheritance occurs today. Keep it that way, or give the writing
project its own `workspace/writing/vercel.json` before changing the root
directory.
