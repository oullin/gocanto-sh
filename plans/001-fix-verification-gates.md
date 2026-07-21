# Plan 001: Make `format:check` a real gate and fix the broken root vitest config

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do NOT update `plans/README.md` — the reviewer
> maintains the index.
>
> **Drift check (run first)**: `git diff --stat 7e1c691..HEAD -- Makefile package.json vitest.config.ts .github/workflows/ci.yml workspace/*/package.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `7e1c691`, 2026-07-20
- **Ollin status**: DONE (PR #14 merged into `feat/writing-vitepress-subdomain` as `744491f`, 2026-07-20)
- **Pull request**: https://github.com/oullin/gocanto-sh/pull/14 (base `feat/writing-vitepress-subdomain`, stacked on #13)
- **Worktree**: /Users/gocanto/.claude/worktrees/gocanto-sh-001-verification-gates
- **Branch**: `fix/verification-gates` (base `7e1c691` on `feat/writing-vitepress-subdomain`)

## Why this matters

Two of the repo's verification entry points don't verify anything. (1) The CI
job named `format:check` runs the **write**-mode formatter inside the ephemeral
runner and exits 0 no matter what — unformatted code merges with a green check.
(2) Running `npx vitest run` from the repo root crashes with
`Projects "@gocanto/store" and "@gocanto/writing" have different 'maxWorkers' but same 'sequence.groupOrder'`
and executes 0 tests, and the root config also omits `workspace/domain`, which
has 11 real tests. After this plan, every advertised check actually checks.

## Current state

- `package.json:10` (root) — `"format:check": "make ui-format"`.
- `Makefile:31-33` — `ui-format` runs, inside a Docker container, a blank-lines
  script and then `oxfmt --write` over all git-tracked files. There is no diff
  check afterwards:

    ```make
    ui-format: ui-format-start
    	$(GO_FMT_SUPPORT_EXEC) /bin/bash -lc 'cd /work && git ls-files ... blank-lines.ts'
    	$(GO_FMT_SUPPORT_EXEC) /bin/bash -lc 'cd /work && git ls-files ... $(GO_FMT_SUPPORT_OXFMT) --write --no-error-on-unmatched-pattern'
    ```

- `.github/workflows/ci.yml` — matrix job `task: [format:check, lint, typecheck, test]`,
  each running `pnpm ${{ matrix.task }}` after `pnpm install --frozen-lockfile`.
- `vitest.config.ts` (root, complete file):

    ```ts
    import { defineConfig } from "vitest/config";

    export default defineConfig({
        test: {
            projects: ["workspace/app", "workspace/store", "workspace/llms", "workspace/writing"],
        },
    });
    ```

    Note `workspace/domain` is missing, yet `workspace/domain/src/domain.test.ts`
    exists and passes under `pnpm test` (turbo path).

- Every package's `format:check` script also maps to `make -C ../.. ui-format`
  (e.g. `workspace/app/package.json:11`).
- Formatting config: `.oxfmtrc.json` at repo root (tabWidth 4, LF, final newline).
- The working `test` path is `pnpm test` → `turbo run test` → per-package
  `vitest run --passWithNoTests`.

Repo conventions: 4-space indentation, TypeScript everywhere, config files kept
minimal. Commit style: short imperative subject (see `git log --oneline`, e.g.
"Add RSS feed support and clean up writing site configuration").

## Coding style constraint (user-mandated)

New code must be class-based OOP; standalone functions only when really needed.
This plan is config/Makefile-only — no new TS modules are expected. If you do
add a TS helper (e.g. a check script), structure it as a class with a `run()`
method.

## Commands you will need

| Purpose     | Command          | Expected on success                        |
| ----------- | ---------------- | ------------------------------------------ |
| Install     | `pnpm install`   | exit 0                                     |
| Typecheck   | `pnpm typecheck` | exit 0                                     |
| Tests       | `pnpm test`      | all pass, 5 packages                       |
| Lint        | `pnpm lint`      | exit 0                                     |
| Root vitest | `npx vitest run` | currently crashes — will pass after Step 3 |

## Suggested executor toolkit

- Read `/Users/gocanto/Sites/skills/.agents/skills/typescript-coding-standards/SKILL.md`
  fully before modifying any `.ts` file; treat it as binding for TS changes.

## Scope

**In scope** (the only files you should modify):

- `Makefile`
- `package.json` (root — `format:check` script only)
- `vitest.config.ts` (root)
- `.github/workflows/ci.yml` (only if a formatting-drift backlog forces a
  one-time note; see Step 2)

**Out of scope** (do NOT touch):

- `workspace/*/package.json` scripts — leave per-package `format:check` alone
  for now; the root script is the CI entry point.
- `go-fmt.compose.yaml`, `docker/` — the formatter container itself.
- Any source file reformatting beyond what Step 2's one-time pass requires.
- `workspace/*/vitest.config.ts` — per-package configs stay as they are unless
  Step 3 requires adding `sequence.groupOrder` (see Step 3 for the minimal
  allowed change).

## Git workflow

- Branch: `fix/verification-gates`
- One commit per step; short imperative subject, e.g. "Make format:check fail on formatting drift".
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add a real `ui-format-check` target to the Makefile

Add a new target that runs the same two container commands as `ui-format` and
then fails if anything changed:

```make
ui-format-check: ui-format
	@git diff --exit-code -- . || (echo "Formatting drift detected. Run 'make ui-format' and commit." && exit 1)
```

Point the root `format:check` script at it: in root `package.json`, change
`"format:check": "make ui-format"` to `"format:check": "make ui-format-check"`.

**Verify**: `make ui-format-check` with a clean tree → exit 0. Then append a
stray blank line to any tracked `.ts` file, run `make ui-format-check` again →
exit non-zero with the drift message. Revert the stray edit
(`git checkout -- <file>`).

### Step 2: Run the formatter once and commit any backlog

Run `make ui-format`. If files change, commit them separately
("One-time format pass so format:check starts clean"). If more than ~30 files
change, STOP and report the count instead of committing.

**Verify**: `git status` clean after the commit; `make ui-format-check` → exit 0.

### Step 3: Fix the root vitest config

Edit root `vitest.config.ts` to include all five packages and give the projects
non-conflicting scheduling so the known crash cannot occur:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        projects: [
            "workspace/app",
            "workspace/domain",
            "workspace/llms",
            "workspace/store",
            "workspace/writing",
        ],
    },
});
```

Then run `npx vitest run`. If the
`different 'maxWorkers' but same 'sequence.groupOrder'` error still occurs, the
minimal allowed fix is adding a distinct `test.sequence.groupOrder` number to
each per-package `vitest.config.ts` (0–4). Do not change any other per-package
setting.

**Verify**: `npx vitest run` from the repo root → exit 0, and the summary lists
test files from **five** packages including `workspace/domain/src/domain.test.ts`.

### Step 4: Full gate check

**Verify**: `pnpm typecheck` → exit 0; `pnpm test` → all pass; `pnpm lint` →
exit 0; `pnpm format:check` → exit 0 on the clean tree.

## Test plan

No new test files. The deliverable _is_ verification behavior:

- `pnpm format:check` fails on a dirtied tracked file, passes when clean.
- `npx vitest run` executes the domain suite (11 tests) plus the other four
  packages.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm format:check` exits 0 on a clean tree
- [ ] After adding a stray blank line to a tracked `.ts` file, `pnpm format:check` exits non-zero (revert afterwards)
- [ ] `npx vitest run` exits 0 and runs tests from 5 packages (domain included)
- [ ] `pnpm typecheck`, `pnpm test`, `pnpm lint` all exit 0
- [ ] `git status` shows no modified files outside the in-scope list

## STOP conditions

Stop and report back (do not improvise) if:

- Docker is unavailable in your environment — `make ui-format` cannot run;
  report that the format gate cannot be verified here.
- Step 2's one-time format pass touches more than ~30 files.
- Step 3's crash persists after adding distinct `groupOrder` values.
- Fixing the root vitest run appears to require changing test _code_ (not
  config) in any package.

## Maintenance notes

- CI's `format:check` job now needs Docker on the runner (ubuntu-latest has
  it), and still rebuilds the go-fmt image each run; caching that image is a
  deliberate follow-up, not in this plan.
- If a sixth workspace package is added, it must be listed in both root
  `vitest.config.ts` and get real `lint`/`format:check` scripts (see plan 002).
- Reviewer: scrutinize that `ui-format-check`'s `git diff --exit-code` runs on
  the host, not inside the container, so exit codes propagate.
