# Plan 010: Make the llms generator's build integration honest and cache-safe

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do NOT update `plans/README.md` — the reviewer
> maintains the index.
>
> **Drift check (run first)**: `git diff --stat 7e1c691..HEAD -- workspace/llms turbo.json workspace/app/package.json workspace/app/scripts/prerender.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition. (Plan 009 touching
> `generate-markdown.ts` content is expected — only structural drift matters.)

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED (build-pipeline reordering can drop deploy artifacts)
- **Depends on**: plans/009-bio-in-llms-bundle.md (land the content change first)
- **Category**: tech-debt
- **Planned at**: commit `7e1c691`, 2026-07-20
- **Ollin status**: PR ready (approved 2026-07-20; commits `75e7be4`, `a1f9b48`, `6a85480` reviewer-created from executor work; lockfile reconciled by reviewer)
- **Pull request**: https://github.com/oullin/gocanto-sh/pull/25
- **Worktree**: /Users/gocanto/.claude/worktrees/gocanto-sh-010-llms-build
- **Branch**: `refactor/llms-build-integration` (base `f126e77`)
- **Model**: gpt-5.6-sol · **Level**: high · **Harness**: codex CLI 0.144.6

## Why this matters

The llms generator reaches across package boundaries: it writes directly into
`workspace/app/dist`, and its build ordering is enforced by a **phantom
devDependency** on `@gocanto/app` that no code imports. turbo's global build
task declares `outputs: ["dist/**"]`, which for the llms package matches
nothing — so on a turbo cache hit the generator is skipped and restores
nothing, and `llms.txt`/`*.md`/`sitemap.xml` silently vanish from `app/dist`.
Today the GitHub Pages deploy has no turbo cache step so production is safe,
but any local incremental build already hits this, and adding CI caching to
the deploy would ship a broken bundle. Also, the write-at-import structure of
the generator makes the output contract untestable.

## Current state

- `workspace/llms/package.json` — `"build": "tsx src/generate-markdown.ts"`;
  devDependencies include `"@gocanto/app": "workspace:*"` (grep confirms zero
  imports of `@gocanto/app` under `workspace/llms/src`).
- `workspace/llms/src/generate-markdown.ts` — top-level script:
  `const distDir = resolve(__dirname, "../../app/dist")`, `mkdirSync`, then a
  local `write(name, body)` (appends trailing newline) called ~10 times, then
  a `console.log`. All side effects at import time.
- `turbo.json` build task: `"dependsOn": ["^build"], "outputs": ["dist/**"]`.
- `workspace/app/package.json` build:
  `vue-tsc -b && vite build --configLoader runner && tsx scripts/prerender.ts`.
- Turbo supports per-package overrides via a `turbo.json` in the package with
  `"extends": ["//"]`.
- Tests pattern: `workspace/llms/src/__tests__/*` (22+ tests, pure functions).

## Coding style constraint (user-mandated)

New code must be class-based OOP; standalone functions only when really needed.
The refactored generator should be a class — see Step 1 (`MarkdownBundle`).

## Commands you will need

| Purpose     | Command                             | Expected on success                             |
| ----------- | ----------------------------------- | ----------------------------------------------- |
| Full build  | `pnpm build`                        | exit 0; app/dist contains llms files            |
| llms build  | `pnpm --filter @gocanto/llms build` | exit 0                                          |
| llms tests  | `pnpm --filter @gocanto/llms test`  | all pass                                        |
| Typecheck   | `pnpm typecheck`                    | exit 0                                          |
| Cache probe | `pnpm build && pnpm build`          | second run: llms task cache behavior per Step 3 |

## Suggested executor toolkit

- Read `/Users/gocanto/Sites/skills/.agents/skills/typescript-coding-standards/SKILL.md`
  fully before writing any `.ts` file; treat it as binding.

## Scope

**In scope** (the only files you should modify/create):

- `workspace/llms/src/markdown-bundle.ts` (create — the `MarkdownBundle` class)
- `workspace/llms/src/generate-markdown.ts` (becomes a thin shell)
- `workspace/llms/src/__tests__/markdown-bundle.test.ts` (create)
- `workspace/llms/package.json` (remove phantom devDep — see Step 2 decision)
- `workspace/llms/turbo.json` (create — per-package task override)

**Out of scope** (do NOT touch):

- `workspace/app/scripts/prerender.ts` and the app build script — Option B
  below deliberately avoids restructuring the app's pipeline.
- Formatter/content files (`formatters.ts`, `bio-formatter.ts`, `llms-txt.ts`,
  `sitemap.ts`) beyond imports.
- `.github/workflows/*` — no CI change in this plan.

## Git workflow

- Branch: `refactor/llms-build-integration`
- One commit per step. Short imperative subjects.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Extract a pure, testable `MarkdownBundle` class

Create `workspace/llms/src/markdown-bundle.ts`:

```ts
export class MarkdownBundle {
    constructor(private readonly sources: { profile: …; projects: …; /* all fixtures */ }) {}

    /** Pure: filename → file contents (with trailing newline). */
    files(): ReadonlyMap<string, string> { /* builds all .md + llms.txt + sitemap.xml */ }

    writeTo(distDir: string): void { /* mkdirSync + writeFileSync per entry */ }
}
```

`files()` must produce exactly the entries `generate-markdown.ts` writes today
(including `bio.md` if plan 009 landed — mirror the live file, not this plan's
assumption). `generate-markdown.ts` becomes: import fixtures, build
`new MarkdownBundle({...})`, call `writeTo(resolve(__dirname, "../../app/dist"))`,
log `[llms] wrote ${files().size} files … into ${distDir}` (derived count, not
a hardcoded number).

**Verify**: `pnpm --filter @gocanto/llms build` output files are byte-identical
to before (run before/after and `diff -r` the generated files, e.g. stash a
copy of `workspace/app/dist/*.md llms.txt sitemap.xml` first).

### Step 2: Replace the phantom devDependency with an explicit turbo dependency

Remove `"@gocanto/app": "workspace:*"` from `workspace/llms/devDependencies`.
Create `workspace/llms/turbo.json`:

```json
{
    "extends": ["//"],
    "tasks": {
        "build": {
            "dependsOn": ["@gocanto/app#build"],
            "cache": false
        }
    }
}
```

`dependsOn: ["@gocanto/app#build"]` states the real ordering requirement
(app's dist must exist and be final before llms writes into it) without a fake
package dependency. `cache: false` is the honest setting: the task's outputs
live in another package's directory, which turbo cannot correctly cache —
never serve it from cache.

**Verify**: `pnpm install` → exit 0 (lockfile updates);
`pnpm build` → exit 0 AND `ls workspace/app/dist/llms.txt sitemap.xml` exist
AND turbo's task graph shows `@gocanto/llms#build` running after
`@gocanto/app#build` (visible in the stream output order).

### Step 3: Prove cache-safety

Run `pnpm build` twice in a row. On the second run, confirm in turbo output
that `@gocanto/llms#build` executes again (cache disabled) — and that
`workspace/app/dist/llms.txt` still exists afterwards. (If `@gocanto/app#build`
is served from cache and restores `dist/**`, the llms rerun repopulates the
generated files on top — order guaranteed by the dependsOn.)

**Verify**: after the double build, `ls workspace/app/dist/llms.txt bio.md sitemap.xml profile.md` all exist.

### Step 4: Test the bundle contract

`__tests__/markdown-bundle.test.ts`: instantiate `MarkdownBundle` with the
real store fixtures and assert `files()` keys equal the exact expected set
(the 8-or-9 `.md` names + `llms.txt` + `sitemap.xml` — read the live
`generate-markdown.ts` for the authoritative list), every value ends with
`"\n"`, and `index.md` contains each section heading. No filesystem in this
test.

**Verify**: `pnpm --filter @gocanto/llms test` → all pass.

### Step 5: Full gate

**Verify**: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` all exit 0.

## Test plan

Step 4's contract test is the core (a dropped `write` call or wrong filename
now fails a test instead of silently shipping a broken public bundle).
Pattern: existing `workspace/llms/src/__tests__/*`.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `grep -n "@gocanto/app" workspace/llms/package.json` returns nothing
- [ ] `workspace/llms/turbo.json` exists with `dependsOn: ["@gocanto/app#build"]` and `cache: false`
- [ ] Generated bundle byte-identical pre/post refactor (Step 1 diff)
- [ ] Double `pnpm build` leaves all bundle files present in `workspace/app/dist`
- [ ] `files()` contract test passes; log line derives its count
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all exit 0
- [ ] No files outside the in-scope list modified

## STOP conditions

Stop and report back (do not improvise) if:

- turbo (v2.9.x) rejects the `@gocanto/app#build` dependsOn syntax in a
  package-level turbo.json — report the exact error; do NOT fall back to
  re-adding the phantom devDep without instruction.
- Removing the devDep changes install/build behavior anywhere else
  (`pnpm build` failure in an unrelated package).
- Step 1's byte-identical check fails — the refactor must be behavior-neutral;
  investigate before proceeding, and stop if the difference isn't a trivially
  explainable ordering artifact.

## Maintenance notes

- The real fix candidate long-term: llms emits to its own `dist/` and the
  deploy step composes directories — revisit if a second consumer of the
  bundle appears. Deliberately deferred: it changes `pages.yml`.
- If the app's `vite build` ever moves to `emptyOutDir` semantics that run
  AFTER prerender, the ordering assumption here breaks — the dependsOn keeps
  llms last, but re-verify after any app build-script change.
- Reviewer: confirm `cache: false` (not fabricated `outputs` pointing across
  packages) — turbo does not support cross-package output dirs safely.
