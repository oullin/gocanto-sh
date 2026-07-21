# Plan 011: Make the store the single source of identity data (fix the sameAs drift)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do NOT update `plans/README.md` — the reviewer
> maintains the index.
>
> **Drift check (run first)**: `git diff --stat 7e1c691..HEAD -- workspace/app/index.html workspace/store/src/links.ts workspace/store/src/profile.ts workspace/app/scripts/prerender.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED (touches SEO structured data and the prerender step)
- **Depends on**: plans/005-critical-path-tests.md (PrerenderInjector class +
  prerender test scaffolding exist after it)
- **Category**: tech-debt
- **Planned at**: commit `7e1c691`, 2026-07-20
- **Ollin status**: PR DRAFT→ready (approved 2026-07-20; commits parent-created from executor-authored work after sandbox commit denial; JSON-LD/sameAs/hashes verified by reviewer)
- **Pull request**: https://github.com/oullin/gocanto-sh/pull/24 (base `test/critical-path-coverage`, stacked on #19)
- **Worktree**: /Users/gocanto/.claude/worktrees/gocanto-sh-011-identity
- **Branch**: `refactor/jsonld-from-store` (base `d22a2e4` = plan 005's head, stacked on #19)
- **Model**: gpt-5.6-sol · **Level**: high · **Harness**: codex CLI 0.144.6
- **Scope amendment (2026-07-20)**: `vercel.json` added to in-scope strictly for the CSP inline-script hash recompute (plan 004's documented procedure) since this plan changes the built JSON-LD contents.

## Why this matters

Identity facts live in three hand-maintained copies and they have **already
diverged**: the JSON-LD `Person.sameAs` in `index.html` lists X, GitHub,
LinkedIn, **YouTube, and Instagram**, while the store's canonical `links.ts`
has X, writing, LinkedIn, GitHub, github_oullin — no YouTube or Instagram.
Search engines are being told a different set of profiles than the site
itself publishes. Every future identity change (email, job title, a dropped
social account) currently requires lockstep edits in `index.html`, the store,
and the llms output. This plan makes the store canonical and generates the
JSON-LD from it at build time.

## Current state

- `workspace/app/index.html` — inline
  `<script type="application/ld+json">` with a `@graph` of `Person`
  (name, alternateName, url, image, jobTitle "Software Architect & Principal
  Engineer", email `gus@oullin.io`, description, worksFor Oullin, knowsAbout
  8 items, sameAs 5 URLs incl.
  `https://www.youtube.com/@gocanto`, `https://www.instagram.com/gocanto`)
  and `WebSite`. Also `<meta>` OG/Twitter tags with overlapping identity
  strings (leave the meta tags alone in this plan — JSON-LD only).
- `workspace/store/src/links.ts` — `links.data`: 5 records
  (x, writing, linkedin, github, github_oullin), each `{ uuid, handle, url,
description, name }`.
- `workspace/store/src/profile.ts` — `profile.data` holds `name`, `nickname`,
  `handle`, `email` (`gus@oullin.io`), `profession`.
- `workspace/app/scripts/prerender.ts` — after `vite build`, renders the app
  and splices HTML into `dist/index.html` (via `PrerenderInjector` once plan
  005 lands). This is the natural place to also inject generated JSON-LD.
- The prerender only runs for production builds; `pnpm dev` serves raw
  `index.html`.

**Decision needed and resolved here**: YouTube/Instagram appear ONLY in
index.html's sameAs. The store is declared canonical. Whether those two
profiles should be _added to the store_ or _dropped from sameAs_ is a content
decision — the plan defaults to **adding them to `links.ts`** (preserving
current SEO claims; removing a live sameAs URL is the riskier change). Flag
this default prominently in the PR description.

## Coding style constraint (user-mandated)

New code must be class-based OOP; standalone functions only when really needed.
The generator in Step 1 is a class (`StructuredDataBuilder`).

## Commands you will need

| Purpose       | Command                                                                                                                                                                                             | Expected on success |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| Build         | `pnpm build`                                                                                                                                                                                        | exit 0              |
| App tests     | `pnpm --filter @gocanto/app test`                                                                                                                                                                   | all pass            |
| Typecheck     | `pnpm typecheck`                                                                                                                                                                                    | exit 0              |
| JSON-LD check | `node -e "const m=require('fs').readFileSync('workspace/app/dist/index.html','utf8').match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/); JSON.parse(m[1]); console.log('valid')"` | prints `valid`      |

## Suggested executor toolkit

- Read `/Users/gocanto/Sites/skills/.agents/skills/typescript-coding-standards/SKILL.md`
  fully before writing any `.ts` file; treat it as binding.

## Scope

**In scope** (the only files you should modify/create):

- `workspace/app/src/lib/structured-data.ts` (create — `StructuredDataBuilder`)
- `workspace/app/src/lib/structured-data.test.ts` (create)
- `workspace/app/scripts/prerender.ts` (inject generated JSON-LD)
- `workspace/app/index.html` (replace the hardcoded JSON-LD body with a
  placeholder comment marker)
- `workspace/store/src/links.ts` (add youtube + instagram records — see the
  resolved decision above)
- `workspace/store/src/types.ts` ONLY if a `kind`/`sameAs` flag is needed to
  distinguish social profiles from internal links (writing.gocanto.sh must NOT
  appear in sameAs — it's the person's own site, list it via the WebSite
  entity or omit)

**Out of scope** (do NOT touch):

- `<meta>` OG/Twitter tags in index.html — same duplication problem, but
  templating meta tags through prerender is a bigger change; deferred.
- `workspace/llms/**` — already reads the store.
- CSP hashes (plan 004): NOTE the interaction — if plan 004 landed with a
  hash for the JSON-LD script, this plan changes its content; recompute is
  plan-004's documented procedure. State this in your report.

## Git workflow

- Branch: `refactor/jsonld-from-store`
- Commits: 1) store additions, 2) builder + prerender wiring, 3) tests.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: `StructuredDataBuilder`

Create `workspace/app/src/lib/structured-data.ts`: class taking
`{ profile, links }` fixtures (+ site constants: url, image path, jobTitle,
worksFor, knowsAbout — inline these as static config in the class for now,
matching today's JSON-LD values exactly), with `build(): object` returning the
`@graph` structure and `toScriptContents(): string` returning pretty-printed
JSON. `sameAs` derives from links records whose URL is an external profile
(x, linkedin, github, github_oullin? — github_oullin is an org, exclude it;
include youtube/instagram once added). Encode the inclusion rule explicitly
(e.g. a `SAME_AS_NAMES` allowlist constant) so it's reviewable.

**Verify**: `pnpm typecheck` → exit 0; unit test in Step 3 pins the output.

### Step 2: Prerender injection

- In `index.html`, replace the JSON-LD script **body** with a marker comment:
  `<script type="application/ld+json"><!--__JSONLD__--></script>` (keep the
  script tag so dev mode has valid-but-empty structured data, or inline the
  current JSON as fallback — prefer keeping the current JSON as the dev
  fallback and have prerender REPLACE the script's contents).
- In `scripts/prerender.ts`, after the app-HTML splice, replace the JSON-LD
  script contents with `new StructuredDataBuilder({ profile, links }).toScriptContents()`
  (import fixtures from `@gocanto/store`). Throw if the script tag isn't found
  (same STOP-style error as the app-div markers).

**Verify**: `pnpm build` → exit 0; the JSON-LD check command prints `valid`;
`node -e` extract shows `sameAs` matching the store-derived list exactly.

### Step 3: Store additions + tests

- Add youtube (`https://www.youtube.com/@gocanto`) and instagram
  (`https://www.instagram.com/gocanto`) records to `links.ts` following the
  existing record shape (new UUIDs, `name: "youtube"` / `"instagram"`,
  descriptive `description`).
- `structured-data.test.ts`: builder output has `@context`, Person `@id`
  `https://gocanto.sh/#person`, email/jobTitle match `profile.data`, `sameAs`
  equals the expected URL set (assert exact array), WebSite entity present,
  and NO `writing.gocanto.sh` in sameAs.
- Check store fixture tests still pass (links count changed — plan 005
  removed brittle counts; if it hasn't landed, update the pinned length).

**Verify**: `pnpm --filter @gocanto/app test` and
`pnpm --filter @gocanto/store test` → all pass.

### Step 4: Drift tripwire + full gate

Add one assertion to `structured-data.test.ts`: the built sameAs set contains
every `SAME_AS_NAMES` entry — i.e. the allowlist and store can't silently
diverge again.

**Verify**: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` all exit 0;
built `dist/index.html` JSON-LD parses and `grep -c "youtube" workspace/app/dist/index.html` ≥ 1.

## Test plan

Step 3–4 tests pin the generated structure; llms output needs no change
(links.md gains the two new records automatically — mention in report).
Search corpus also derives from links (GlobalSearch lists links) — confirm
`pnpm --filter @gocanto/app test` still passes and note the two new search
entries in the report.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] Hardcoded sameAs URLs are gone from the SOURCE `index.html` JSON-LD (dev fallback may keep current values only if Step 2's replace strategy is used — grep the built dist instead: sameAs in `dist/index.html` derives from the store)
- [ ] `links.ts` contains youtube + instagram records
- [ ] Builder tests pass incl. the allowlist/store drift tripwire
- [ ] JSON-LD in built `dist/index.html` is valid JSON with Person + WebSite
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all exit 0
- [ ] No files outside the in-scope list modified

## STOP conditions

Stop and report back (do not improvise) if:

- The prerender cannot import `@gocanto/store` fixtures in its node context
  (it currently builds an SSR bundle — fixture imports should work via tsx,
  but if module resolution fails, report the error rather than restructuring).
- Adding links records breaks domain/search tests in ways beyond a count
  change.
- You find OTHER consumers of the hardcoded sameAs (grep
  `youtube.com/@gocanto` repo-wide first) — report them.
- Plan 004's CSP hashes are live and you cannot follow its recompute
  procedure.

## Maintenance notes

- The `<meta>` OG/Twitter identity strings are the remaining duplication —
  candidate follow-up using the same builder.
- Content edits to identity now happen in `workspace/store` only; the JSON-LD
  follows on the next build. Document in plan 013's onboarding doc.
- Reviewer: diff the built JSON-LD against the pre-change version — the ONLY
  intended deltas are formatting and store-derived values; jobTitle/worksFor/
  knowsAbout must be unchanged.

## Post-delivery addendum (2026-07-20, review finding)

`<script type="application/ld+json">` is a data block, not executable script —
CSP `script-src` does not apply to it, so it never needed a hash. The JSON-LD
hash was removed from `vercel.json` in the follow-ups PR (#28), which also
eliminates the recompute-hash-on-content-change maintenance step this plan's
notes warned about. Only the executable theme-bootstrap inline script keeps a
CSP hash.
