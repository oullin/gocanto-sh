# Plan 012: Spike — extend the machine-readable layer and search to writing.gocanto.sh

> **Executor instructions**: This is a DESIGN SPIKE, not a build plan. The
> deliverable is a written design document plus at most one throwaway
> prototype script — no production source changes. Follow the steps, honor
> STOP conditions. Do NOT update `plans/README.md` — the reviewer maintains
> the index.
>
> **Drift check (run first)**: `git diff --stat 7e1c691..HEAD -- workspace/writing workspace/llms/src workspace/app/src/components/GlobalSearch.vue`
> On structural drift (files moved/deleted), STOP.

## Status

- **Priority**: P3
- **Effort**: M (spike)
- **Risk**: LOW (no production changes)
- **Depends on**: plans/009-bio-in-llms-bundle.md (bundle conventions settled)
- **Category**: direction
- **Planned at**: commit `7e1c691`, 2026-07-20
- **Ollin status**: DONE (2026-07-20; design doc delivered at `plans/design/writing-reach.md`; no production changes, worktree clean)
- **Worktree**: /Users/gocanto/.claude/worktrees/gocanto-sh-012-spike (detached, read-only inventory + build)
- **Model**: gpt-5.6-sol · **Level**: high · **Harness**: codex CLI 0.144.6
- **Delivery amendment (2026-07-20)**: the design doc is written to the parent scratchpad and installed into `plans/design/` by the parent (plans/ is advisor-owned and untracked; no spike branch/PR needed).

## Why this matters

The README's stated differentiator is "machine-readable markdown bundles so
LLM agents can read the same content without scraping" — yet the brand-new
long-form writing (the content agents would most want to cite) is invisible to
that channel: `gocanto.sh/llms.txt` and `sitemap.xml` never reference
`writing.gocanto.sh`, the writing site emits no `llms.txt` of its own, and the
two sites have two disjoint searches (the app's ⌘K palette indexes seven store
sections; the writing site has VitePress local search + a custom index
filter). This spike decides the architecture before anyone builds it.

## Current state

- `workspace/llms/src/llms-txt.ts` — renders gocanto.sh's `llms.txt` from the
  profile fixture; section list is hardcoded links to `${siteUrl}/*.md`.
- `workspace/llms/src/sitemap.ts` — `MD_PAGES` list + `renderSitemap`; no
  writing URLs.
- `workspace/writing/posts.data.ts` — `createContentLoader("posts/*.md")`
  builds `Post[]` (title, url, date.{raw,display,short,year}, readingTime,
  description, tags) at build time; posts carry frontmatter
  title/description/tags/date.
- `workspace/writing/.vitepress/rss.ts` — RSS already generated at `buildEnd`
  via `writeRssFeed(outDir)`; `SITE_URL = "https://writing.gocanto.sh"`.
- `workspace/writing/.vitepress/config.ts` — VitePress config; has its own
  sitemap (per the direction audit) and local search provider.
- `workspace/app/src/components/GlobalSearch.vue` — corpus built lazily from
  `@gocanto/domain` (`buildCorpus()`), kinds are the seven store sections;
  filtering delegated to reka-ui Command via `search-value`.
- Deployment: the two sites deploy as SEPARATE projects (app via
  pages.yml/Vercel; writing via its own Vercel project per README). Neither
  build can write files into the other's deploy — any cross-site data flows
  over HTTP at build time or runtime.

## Coding style constraint (user-mandated)

New code must be class-based OOP; standalone functions only when really
needed. Applies to the prototype script and to the designs this spike
proposes (design the future generators/loaders as classes).

## Commands you will need

| Purpose        | Command                                | Expected on success                 |
| -------------- | -------------------------------------- | ----------------------------------- |
| Writing build  | `pnpm --filter @gocanto/writing build` | exit 0; `.vitepress/dist` populated |
| Inspect output | `ls workspace/writing/.vitepress/dist` | see emitted files                   |

## Scope

**In scope** (the only files you may create):

- `plans/design/writing-reach.md` (create — THE deliverable)
- One optional throwaway prototype under the session scratchpad or
  `plans/design/prototype/` (clearly marked, never imported by production code)

**Out of scope** (do NOT touch):

- ALL production source and config files, in every package.
- Deploy workflows.

## Git workflow

- Branch: `spike/writing-reach`
- One commit containing the design doc. Do NOT push or open a PR unless the
  operator instructed it.

## Steps

### Step 1: Inventory the writing site's actual build outputs

Run the writing build and list `.vitepress/dist` (html files, `feed.rss`,
whether VitePress emitted a `sitemap.xml`). Record in the design doc what
exists today.

**Verify**: the design doc's "current outputs" section lists real filenames
from the build you ran.

### Step 2: Design the machine-readable layer for writing

Answer, with a recommendation and rationale each:

1. Should `writing.gocanto.sh` emit its own `llms.txt` + per-post raw `.md`?
   (Posts are already markdown; VitePress can copy them via `public/` or a
   `buildEnd` hook like `writeRssFeed`. Recommend the hook — design a
   `WritingBundle` class mirroring plan 010's `MarkdownBundle`.)
2. How does `gocanto.sh/llms.txt` point to writing? (Recommend: one "Writing"
   section link to `https://writing.gocanto.sh/llms.txt` — federation, not
   duplication; the two builds stay independent.)
3. Should the main `sitemap.xml` list writing URLs? (Research: cross-host URLs
   in one sitemap are only valid with cross-host verification; likely keep
   separate sitemaps + ensure writing has its own. State the finding.)

### Step 3: Design cross-site search

Answer with a recommendation:

1. Index shape: a build-time `search-index.json` emitted by the writing build
   (title/url/description/tags/date per post — essentially `Post[]`
   serialized).
2. Transport: app fetches
   `https://writing.gocanto.sh/search-index.json` lazily when the palette
   opens (same lazy pattern as the recommendations chunk) — with the plan-007
   error/retry behavior; staleness is acceptable (index updates on writing
   deploys).
3. UI: new "Writing" kind in GlobalSearch with an external-link result
   behavior (opens the post URL) — note this diverges from the Sheet-detail
   pattern of other kinds and needs a small design decision.
4. CORS: writing must serve the JSON with `access-control-allow-origin:
https://gocanto.sh` (or `*` — it's public data); note where that config
   lives per the plan-004 deploy findings.

### Step 4: Effort + sequencing + open questions

Break the recommended designs into 2–3 buildable follow-up plan outlines
(titles + S/M/L + dependency order), and list open questions only the owner
can answer (e.g. should posts also appear in the main site's llms index.md?
does the owner want search-to-external-navigation UX?).

**Verify**: `plans/design/writing-reach.md` contains: current outputs,
decisions 2.1–2.3 and 3.1–3.4 each with a recommendation, follow-up plan
outlines, and open questions. `git status` shows ONLY the design doc (and
optional prototype dir) as new files.

## Test plan

None — spike. The doc's quality bar: a maintainer can turn each follow-up
outline into a full plan without re-deriving the analysis.

## Done criteria

- [ ] `plans/design/writing-reach.md` exists with all four sections
- [ ] Every recommendation cites the current-state evidence (file paths)
- [ ] No production file modified (`git status` clean apart from the doc)

## STOP conditions

Stop and report back if:

- The writing build fails at baseline (report the error — that's a finding).
- Any step seems to require editing production code — this spike must not.

## Maintenance notes

- Revisit decision 3 if the post count stays tiny — federated search may not
  be worth it below ~5 posts; say so in the doc's recommendation.
