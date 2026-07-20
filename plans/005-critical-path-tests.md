# Plan 005: Test the SSR prerender, posts/RSS validation, and de-flake the app suite

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do NOT update `plans/README.md` — the reviewer
> maintains the index.
>
> **Drift check (run first)**: `git diff --stat 7e1c691..HEAD -- workspace/app/src/entry-server.ts workspace/app/scripts/prerender.ts workspace/writing/posts.data.ts workspace/writing/.vitepress/rss.ts workspace/app/vitest.config.ts workspace/store/src/__tests__/fixtures.test.ts turbo.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW (additive tests + config)
- **Depends on**: plans/001-fix-verification-gates.md (root vitest must run all packages)
- **Category**: tests
- **Planned at**: commit `7e1c691`, 2026-07-20
- **Ollin status**: PR READY (CI green on remediated head `d22a2e4`; UTC-formatter fix + assertion tidy landed from bot review; prerender-matcher thread left open with rationale for maintainer decision; approved 2026-07-20; 108+ tests)
- **Pull request**: https://github.com/oullin/gocanto-sh/pull/19 (base `feat/writing-vitepress-subdomain`; plans 001–004 merged into base)
- **Worktree**: /Users/gocanto/.claude/worktrees/gocanto-sh-005-critical-tests
- **Branch**: `test/critical-path-coverage` (base `fced5b8` = plan 004's PR-READY head)

## Why this matters

The two places where a bug breaks a **production build** have zero tests:
(1) the SSR prerender — any component that throws during server render kills
`pnpm build` with no earlier signal; (2) the writing site's frontmatter date
validation — a malformed `date:` in any post throws inside `vitepress build`
via the RSS writer. Additionally, the app suite runs with `isolate: false`
while sharing a module-level singleton (latent order-dependent flakiness), and
the store fixture tests pin exact collection lengths (23/37/46) so every
legitimate content edit breaks them.

## Current state

- `workspace/app/src/entry-server.ts` — exports
  `render(): Promise<string>` via `renderToString(createSSRApp(App))`. No test.
- `workspace/app/scripts/prerender.ts:37-44` — splice logic:

    ```ts
    const template = await readFile(distIndex, "utf8");
    const appStart = template.indexOf('<div id="app">');
    const bodyEnd = template.lastIndexOf("</body>");
    const appEnd = bodyEnd > appStart ? template.lastIndexOf("</div>", bodyEnd) : -1;

    if (appStart === -1 || appEnd === -1) {
        throw new Error('[prerender] could not locate <div id="app"> in dist/index.html');
    }
    ```

- `workspace/app/vitest.config.ts` — `include: ["src/**/*.test.ts"]`,
  `environment: "happy-dom"`, `isolate: false`, `pool: "threads"`,
  `singleThread: true`.
- `turbo.json` test task inputs: `["src/**", "vitest.config.ts", "package.json", "tsconfig.json"]`
  — `scripts/` is not an input, so prerender changes don't invalidate the test cache.
- `workspace/app/src/lib/globalSearch.ts` — module-level singleton:
  `export const globalSearchOpen = ref(false)` (8-line file).
- `workspace/writing/posts.data.ts` — pure, exported-or-exportable helpers:
  `readingTime(src)` (strips frontmatter + code fences, ~200wpm, min "1 min"),
  `normalizeDate(value, url)` (Date→`YYYY-MM-DD`, throws on invalid Date,
  returns null for non-string), `formatDate(raw, url)` (throws on
  `Number.isNaN` or round-trip mismatch, note `2026-02-30` normalizes to Mar 2
  so the round-trip check catches it), `normalizeTags(value)` (array filter /
  string wrap / else `[]`). Currently `readingTime`, `normalizeDate`,
  `formatDate`, `normalizeTags` are module-private (not exported).
- `workspace/writing/.vitepress/rss.ts` — `parsePostDate(post)` throws
  `Cannot generate RSS for <url>: invalid date <raw>`;
  `serveRssRequest(request, response)` returns `false` unless
  `pathname === "/feed.rss"` and method is GET/HEAD. `renderRssFeed` is
  already well tested in `workspace/writing/.vitepress/__tests__/rss.test.ts`
  — use that file as the structural pattern.
- `workspace/store/src/__tests__/fixtures.test.ts:77,90,97` — brittle pins:
  `toHaveLength(23)`, `toHaveLength(37)`, `toHaveLength(46)` plus
  first-element UUID assertions at lines 78, 91, 98.
- Existing app test pattern: `workspace/app/src/lib/utils.test.ts` and
  `workspace/app/src/components/__tests__/*.test.ts` (vitest, no globals —
  explicit `import { describe, expect, it } from "vitest"`).

## Coding style constraint (user-mandated)

New code must be class-based OOP; standalone functions only when really needed.
Apply it here: when extracting the prerender splice logic (Step 2), create a
**class** (e.g. `PrerenderInjector` with a constructor taking the template and
an `inject(appHtml): string` method) rather than a bare function. Test helpers
may be plain where vitest idioms demand it. Do not rewrite existing
function-style code beyond what the steps specify.

## Commands you will need

| Purpose       | Command                               | Expected on success |
| ------------- | ------------------------------------- | ------------------- |
| Install       | `pnpm install`                        | exit 0              |
| App tests     | `pnpm --filter @gocanto/app test`     | all pass            |
| Writing tests | `pnpm --filter @gocanto/writing test` | all pass            |
| Store tests   | `pnpm --filter @gocanto/store test`   | all pass            |
| All tests     | `pnpm test`                           | all pass            |
| Build         | `pnpm build`                          | exit 0              |
| Typecheck     | `pnpm typecheck`                      | exit 0              |

## Suggested executor toolkit

- Read `/Users/gocanto/Sites/skills/.agents/skills/typescript-coding-standards/SKILL.md`
  fully before writing any `.ts` file; treat it as binding.

## Scope

**In scope** (the only files you should modify/create):

- `workspace/app/src/entry-server.test.ts` (create)
- `workspace/app/scripts/prerender.ts` (extract splice logic only)
- `workspace/app/src/lib/prerender-injector.ts` (create — the extracted class;
  placing it under `src/` keeps it inside the vitest `include` glob)
- `workspace/app/src/lib/prerender-injector.test.ts` (create)
- `workspace/app/vitest.config.ts` (isolation setting)
- `turbo.json` (add `scripts/**` to test inputs)
- `workspace/writing/posts.data.ts` (export the four helpers — no logic change)
- `workspace/writing/.vitepress/__tests__/posts-data.test.ts` (create)
- `workspace/writing/.vitepress/__tests__/rss-serve.test.ts` (create)
- `workspace/store/src/__tests__/fixtures.test.ts` (replace brittle pins)

**Out of scope** (do NOT touch):

- `workspace/app/src/main.ts` and the vitals logic — that is plan 006.
- Component test additions beyond `entry-server.test.ts`.
- `workspace/writing/.vitepress/rss.ts` logic — tests only, no refactor.
- `workspace/app/src/App.vue` or any component — if the SSR smoke test fails
  because a component throws, that is a STOP condition (real bug found).

## Git workflow

- Branch: `test/critical-path-coverage`
- One commit per step. Short imperative subjects.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: SSR render smoke test

Create `workspace/app/src/entry-server.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { render } from "./entry-server";

describe("entry-server", () => {
    it("renders the app to a non-empty HTML string without throwing", async () => {
        const html = await render();

        expect(html.length).toBeGreaterThan(1000);
        expect(html).toContain("Gustavo");
    });
});
```

(If `render` is not exported with that name, mirror the actual export of
`entry-server.ts`.) This runs in happy-dom; `renderToString` needs no real DOM.

**Verify**: `pnpm --filter @gocanto/app test` → passes, includes the new file.

### Step 2: Extract and test the prerender splice as a class

Create `workspace/app/src/lib/prerender-injector.ts` exporting a
`PrerenderInjector` class that owns the current splice logic from
`prerender.ts:37-48`: constructor takes the template string; `inject(appHtml)`
returns the new HTML or throws the exact existing error message when markers
are missing. Update `scripts/prerender.ts` to import and use it (behavior
identical). Create `prerender-injector.test.ts` covering: happy path (content
lands between the markers), missing `<div id="app">` → throws, missing
closing `</div>` before `</body>` → throws.

**Verify**: `pnpm --filter @gocanto/app test` passes; `pnpm build` → exit 0 and
the log line `[prerender] dist/index.html prerendered` still appears.

### Step 3: Cache-correctness for scripts/

In `turbo.json`, extend the `test` task inputs to include `"scripts/**"`.

**Verify**: `git diff turbo.json` shows the added input; `pnpm test` passes.

### Step 4: posts.data helpers — export and test

In `workspace/writing/posts.data.ts` add `export` to `readingTime`,
`normalizeDate`, `formatDate`, `normalizeTags` (no logic changes). Create
`workspace/writing/.vitepress/__tests__/posts-data.test.ts` (model after
`rss.test.ts`) covering:

- `formatDate("2026-07-18", url)` → `{ raw, display: "Jul 18, 2026", short, year: "2026" }`
- `formatDate("2026-02-30", url)` → throws (round-trip mismatch)
- `formatDate("garbage", url)` → throws
- `normalizeDate(new Date("invalid"), url)` → throws; `normalizeDate("2026-07-18", url)` → same string; `normalizeDate(42, url)` → null
- `readingTime` strips frontmatter and fenced code; short text → "1 min"
- `normalizeTags(["a", 1, "b"])` → `["a","b"]`; `normalizeTags("solo")` → `["solo"]`; `normalizeTags(undefined)` → `[]`

**Verify**: `pnpm --filter @gocanto/writing test` → all pass.

### Step 5: serveRssRequest routing test

Create `rss-serve.test.ts`: stub minimal `IncomingMessage`/`ServerResponse`
shapes (plain objects with `url`, `method`, and spies for `setHeader`/`end`)
and assert: wrong path → resolves `false` without touching the response;
POST to `/feed.rss` → `false`; GET `/feed.rss` → `true`, status 200,
`Content-Type` = `application/rss+xml; charset=utf-8`; HEAD → `end()` called
with no body argument.

**Verify**: `pnpm --filter @gocanto/writing test` → all pass.

### Step 6: Isolation and brittle-count fixes

- In `workspace/app/vitest.config.ts` set `isolate: true` (delete the
  `isolate: false` line — vitest's default is true). If the app suite slows by
  more than ~2× or fails, fall back to keeping `isolate: false` and instead
  add a setup file that resets `globalSearchOpen.value = false` before each
  test; report which path you took.
- In `workspace/store/src/__tests__/fixtures.test.ts`, replace the three
  `toHaveLength(<N>)` pins and the first-element UUID pins with invariants:
  `expect(x.length).toBeGreaterThan(0)`, keep the existing UUID-uniqueness and
  envelope-shape assertions (those are good), and assert ordering invariants
  where the data has a `sort`/date field instead of pinning element 0's UUID.

**Verify**: `pnpm --filter @gocanto/app test` and
`pnpm --filter @gocanto/store test` → all pass.

## Test plan

Summarized in the steps: 4 new test files (entry-server, prerender-injector,
posts-data, rss-serve), ~15 new cases; pattern files:
`workspace/writing/.vitepress/__tests__/rss.test.ts` and
`workspace/app/src/lib/utils.test.ts`. Final: `pnpm test` green across all
five packages.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] 4 new test files exist and run in `pnpm test`
- [ ] `pnpm build` exits 0 (prerender refactor is behavior-neutral)
- [ ] `grep -n "toHaveLength(23)\|toHaveLength(37)\|toHaveLength(46)" workspace/store/src/__tests__/fixtures.test.ts` returns nothing
- [ ] `grep -n "isolate: false" workspace/app/vitest.config.ts` returns nothing OR a setup-file reset exists (report which)
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test` all exit 0
- [ ] No files outside the in-scope list are modified

## STOP conditions

Stop and report back (do not improvise) if:

- The Step 1 smoke test fails — that means a component actually throws during
  SSR today; that's a real production-build bug to report, not to fix here.
- Extracting the splice logic changes `pnpm build` output (diff
  `dist/index.html` before/after — a byte-identical `<div id="app">` region is
  expected).
- `isolate: true` surfaces cross-file test failures — report them; they are
  the latent bug this step exists to expose.
- Exporting the posts.data helpers breaks the VitePress content loader
  (`pnpm --filter @gocanto/writing build` fails).

## Maintenance notes

- The SSR smoke test is the tripwire for the "component touches window at
  setup" class of bug — keep it fast and unmocked.
- If posts gain new frontmatter fields, extend `posts-data.test.ts` alongside.
- Reviewer: check the `PrerenderInjector` class preserves the exact marker
  semantics (`lastIndexOf("</div>", bodyEnd)`), not a regex rewrite.
