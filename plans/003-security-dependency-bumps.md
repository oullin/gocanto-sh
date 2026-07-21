# Plan 003: Clear critical/high dependency advisories and pin floating versions

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do NOT update `plans/README.md` — the reviewer
> maintains the index.
>
> **Drift check (run first)**: `git diff --stat 7e1c691..HEAD -- package.json pnpm-lock.yaml workspace/app/package.json workspace/domain/package.json workspace/writing/package.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (happy-dom major bump touches the app test environment)
- **Depends on**: plans/001-fix-verification-gates.md (a working test gate
  verifies these bumps)
- **Category**: security
- **Planned at**: commit `7e1c691`, 2026-07-20
- **Ollin status**: DONE (PR #16 merged as `47adf1f`, 2026-07-20; originally approved 2026-07-20; commits `9ed597d`, `15692d9`, `dff0da6`, `df62c9d`; audit 38→26 vulns, 1 crit/8 high → 0 crit/2 high, remaining highs out-of-scope)
- **Pull request**: https://github.com/oullin/gocanto-sh/pull/16 (base `feat/writing-vitepress-subdomain`; plans 001+002 already merged into base)
- **Worktree**: /Users/gocanto/.claude/worktrees/gocanto-sh-003-security-deps
- **Branch**: `chore/security-dependency-bumps` (base `fffc0cd` = plan 002's PR-READY head)

## Why this matters

`pnpm audit` reports 38 advisories; the load-bearing ones are: a **critical**
VM-context-escape RCE in `happy-dom < 20.0.0` (the app's vitest environment),
a **high** `server.fs.deny` bypass in `vite <= 8.0.15`, and three **high**
undici advisories reached via `jsdom` (which runs in the SSR prerender). None
reach the deployed static output — exposure is developer machines and CI — but
a critical advisory in the resolved tree should not persist. Separately, the
root manifest declares `oxc-parser: "latest"` and `oxfmt: "latest"`, letting
any upstream publish flow unreviewed into the format toolchain, and `portless`
(pre-1.0) is on a caret range that would auto-adopt breaking 0.x minors.

## Current state

- `workspace/app/package.json` devDependencies: `"happy-dom": "^15.11.7"`,
  `"vite": "^8.0.11"`, `"jsdom": "^29.1.1"`, `"portless": "^0.13.0"`.
- `workspace/app/vitest.config.ts:18` — `environment: "happy-dom"` (the app's
  16 tests run in it).
- `workspace/domain/package.json` dependencies: `"jsdom": "^29.1.1"` — used at
  runtime by `workspace/domain/src/purify.node.ts` (server-side DOMPurify) and
  externalized in `workspace/app/scripts/prerender.ts:17-18`
  (`ssr: { external: ["jsdom"] }`).
- `workspace/writing/package.json`: `"portless": "^0.13.0"`, and
  `"vitepress": "^1.6.4"` which pins its own `vite@5.x` — **that migration is
  deliberately out of scope here** (tracked as a rejected/deferred item in the
  index; vitepress 1.x cannot move off vite 5).
- Root `package.json` devDependencies:

    ```json
    "oxc-parser": "latest",
    "oxfmt": "latest",
    ```

- Root `pnpm.overrides` already exists (pattern to follow for undici):

    ```json
    "pnpm": {
        "overrides": {
            "stylus": "^0.64.0",
            "glob": "^13.0.6"
        }
    }
    ```

## Coding style constraint (user-mandated)

New code must be class-based OOP; standalone functions only when really needed.
This plan is manifest/lockfile-only; no new TS modules expected. If a test
needs updating for happy-dom 20 behavior, keep the change minimal.

## Commands you will need

| Purpose        | Command                           | Expected on success                                             |
| -------------- | --------------------------------- | --------------------------------------------------------------- |
| Install        | `pnpm install`                    | exit 0                                                          |
| Audit          | `pnpm audit`                      | zero critical, zero high after Step 4 (moderate/low may remain) |
| Tests          | `pnpm test`                       | all pass                                                        |
| App tests only | `pnpm --filter @gocanto/app test` | 16 tests pass                                                   |
| Typecheck      | `pnpm typecheck`                  | exit 0                                                          |
| Build          | `pnpm build`                      | exit 0 (exercises prerender + jsdom path)                       |

## Scope

**In scope** (the only files you should modify):

- `package.json` (root): pin `oxc-parser`/`oxfmt`, add `undici` override
- `workspace/app/package.json`: `happy-dom`, `vite`, `portless` ranges
- `workspace/writing/package.json`: `portless` range
- `workspace/domain/package.json`: `jsdom` range only if a bump is needed
- `pnpm-lock.yaml`
- Test files ONLY if happy-dom 20 changes observable DOM behavior (list each)

**Out of scope** (do NOT touch):

- `vitepress` and its vite 5 chain — separate migration, not this plan.
- `shadcn-vue` and its `@modelcontextprotocol` subtree — dev-scaffolding only;
  note remaining advisories in your report instead of chasing them.
- Any application source code.

## Git workflow

- Branch: `chore/security-dependency-bumps`
- One commit per logical bump group. Short imperative subjects.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Baseline

Run `pnpm audit` and save the output. Record the current counts (expect ~1
critical / 8 high). Run `pnpm test` and `pnpm build` to confirm green before
changing anything.

**Verify**: `pnpm test` → all pass; `pnpm build` → exit 0.

### Step 2: happy-dom major bump

In `workspace/app/package.json`, change `"happy-dom": "^15.11.7"` to
`"happy-dom": "^20.8.9"`. Run `pnpm install`, then
`pnpm --filter @gocanto/app test`.

**Verify**: 16 app tests pass. If specific tests fail on happy-dom 20 DOM
behavior, fix ONLY those assertions/setup lines and list them; if more than 3
test files break, STOP.

### Step 3: vite patch + undici override + jsdom

- Bump `"vite": "^8.0.11"` → `"^8.0.16"` in `workspace/app/package.json`.
- Add `"undici": "^7.28.0"` to root `pnpm.overrides`. (Amended 2026-07-20 during
  execution: the original `>=7.28.0` floor resolved to undici 8.x, which jsdom
  29.1.1 — declared range `^7.25.0` — cannot load
  (`Cannot find module 'undici/lib/handler/wrap-handler.js'`); the caret keeps
  the floor inside major 7.)
- Check `pnpm why undici` afterwards; if jsdom still resolves a vulnerable
  undici, bump `jsdom` in both `workspace/domain` and `workspace/app` to the
  latest 29.x (or the earliest release resolving undici >= 7.28.0).

**Verify**: `pnpm install` → exit 0; `pnpm build` → exit 0 (prerender still
renders; jsdom externalization intact); `pnpm test` → all pass.

### Step 4: Pin floating and pre-1.0 ranges

- Find resolved versions: `pnpm why oxc-parser` / `pnpm why oxfmt` (or grep
  `pnpm-lock.yaml`). Replace `"latest"` with `"^<resolved-version>"` for both
  in root `package.json`.
- Change `"portless": "^0.13.0"` to `"portless": "~0.13.0"` in both
  `workspace/app/package.json` and `workspace/writing/package.json`.

**Verify**: `pnpm install` → exit 0 and lockfile diff shows no version jumps
for these three packages (pins match what was already resolved).

### Step 5: Re-audit and gate

Run `pnpm audit`.

**Verify**: zero critical and zero high advisories, **except** any that trace
exclusively to the out-of-scope `vitepress>vite@5` or `shadcn-vue` subtrees —
list those verbatim in your report. Then `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
all exit 0.

## Test plan

No new test files. The regression net is the existing suites plus a full
`pnpm build` (which exercises the SSR prerender and therefore the jsdom path).
Report the before/after `pnpm audit` summary counts.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm audit` shows 0 critical and 0 high outside the vitepress/shadcn-vue subtrees
- [ ] `grep '"latest"' package.json` returns nothing
- [ ] `grep '"portless"' workspace/*/package.json` shows `~0.13.0` twice
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all exit 0
- [ ] No source files modified except listed happy-dom-related test fixes

## STOP conditions

Stop and report back (do not improvise) if:

- happy-dom 20 breaks more than 3 app test files.
- The undici override causes jsdom to fail at runtime during `pnpm build`
  (prerender step).
- Pinning oxc-parser/oxfmt changes formatting output (`make ui-format` would
  reformat files) — report which version introduced the drift.
- `pnpm audit` surfaces a NEW critical advisory introduced by these bumps.

## Maintenance notes

- The vitepress→vite-5 chain remains the last stuck security floor; revisit
  when vitepress 2.x (vite 6+) is stable — tracked in `plans/README.md`.
- The `stylus`/`glob` overrides remain undocumented dedupe pins; plan 013 adds
  a rationale note. If they block a future bump, re-evaluate rather than force.
- Reviewer: confirm the undici override is `^7.28.0` — a floor within major 7,
  not an exact pin (future jsdom bumps in 7.x aren't blocked) and not `>=`
  (which escapes to undici 8.x and breaks jsdom at runtime). When jsdom moves
  to undici 8, update or drop the override deliberately.
