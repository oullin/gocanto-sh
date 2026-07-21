# Plan 013: Agent onboarding doc, formatter ergonomics, and doc fixes

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do NOT update `plans/README.md` — the reviewer
> maintains the index.
>
> **Drift check (run first)**: `git diff --stat 7e1c691..HEAD -- Makefile README.md package.json workspace/app/.claude .editorconfig`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/001-fix-verification-gates.md (documents the fixed
  gates), plans/004-resolve-deploy-target-and-headers.md (documents the
  resolved deploy story)
- **Category**: dx
- **Planned at**: commit `7e1c691`, 2026-07-20
- **Ollin status**: PR ready (approved 2026-07-20; commits `2a60ab8`, `61ce747`, `2c5df68`, `28a7b26`; 121/121 tests)
- **Pull request**: https://github.com/oullin/gocanto-sh/pull/26
- **Worktree**: /Users/gocanto/.claude/worktrees/gocanto-sh-013-dx
- **Branch**: `docs/agents-onboarding-and-dx` (base `41a3945` — all plans 001–011 merged or in PR)
- **Model**: gpt-5.6-sol · **Level**: high · **Harness**: codex CLI 0.144.6
- **Scope amendments (2026-07-20)**: README llms file list gains `bio.md` (deferred here from plan 009); AGENTS.md traps also document the undici `^7.28.0` override, the linked-worktree Docker-formatter no-op, and the turbo writing-test-input cache gap (plan 005 follow-up).

## Why this matters

This repo has several traps that nothing documents in one place: formatting
requires a running Docker daemon; `make format` silently runs the ENTIRE
verify chain (lint+typecheck+tests) behind a Docker formatter; `format` and
`format-all` are byte-identical duplicate targets; there is no `.editorconfig`
so editors don't learn the 4-space convention that oxfmt enforces; the root
README's `pnpm dev` doesn't mention the portless HTTPS proxy + local CA it
triggers; `workspace/app/.claude/launch.json` is a 0-byte invalid file; and
there is no `CLAUDE.md`/`AGENTS.md` for the agents that execute plans here.
Also the root `pnpm.overrides` (`stylus`, `glob`) carry no rationale.

## Current state

- `Makefile:17-29` — `format:` and `format-all:` contain the SAME four
  commands: `pnpm --filter @gocanto/app exec oxlint . --fix`,
  `$(MAKE) ui-format`, `pnpm lint`, `pnpm typecheck`, `pnpm test`.
- `.oxfmtrc.json` (root): `tabWidth: 4`, `useTabs: false`, `endOfLine: "lf"`,
  `insertFinalNewline: true`. No `.editorconfig` exists anywhere.
- `workspace/app/.claude/launch.json` — 0 bytes. Root `/.claude/launch.json`
  is valid (runs `PORT=5273 pnpm --dir workspace/app dev:app`).
- Root `README.md` Commands section: `pnpm install / dev / typecheck / build`
  with no portless mention. The good portless explanation lives in
  `workspace/writing/README.md:9-24` ("runs behind portless … stable HTTPS URL
  … shared proxy on port 1355 … local CA is set up the first time").
- Root `package.json` `pnpm.overrides`: `"stylus": "^0.64.0"`,
  `"glob": "^13.0.6"` — transitive dedupe pins with no recorded reason
  (stylus enters via shadcn-vue's vue-metamorph and vitepress; glob via
  js-beautify/@vue/test-utils chains).
- No CLAUDE.md or AGENTS.md anywhere in the repo.
- Repo commands (verified): `pnpm typecheck` / `pnpm test` / `pnpm lint` /
  `pnpm build` / `pnpm format:check`; per-package via `pnpm --filter`.

## Coding style constraint (user-mandated)

New code must be class-based OOP; standalone functions only when really
needed. This plan is docs/config; ALSO: the onboarding doc you write MUST
record this constraint so future agents inherit it (see Step 1 outline).

## Commands you will need

| Purpose   | Command            | Expected on success         |
| --------- | ------------------ | --------------------------- |
| Lint      | `pnpm lint`        | exit 0                      |
| Typecheck | `pnpm typecheck`   | exit 0                      |
| Tests     | `pnpm test`        | all pass                    |
| Format    | `make format-code` | exit 0 (new target, Step 2) |

## Scope

**In scope** (the only files you should modify/create):

- `AGENTS.md` (create, repo root) — and a one-line `CLAUDE.md` that says
  "Read AGENTS.md" (or a symlink if the repo owner's tooling supports it —
  prefer the one-line file for portability)
- `Makefile` (dedupe targets, add format-only target)
- `.editorconfig` (create)
- `README.md` (portless note + overrides rationale pointer)
- `package.json` (root — script wiring if Makefile target names change)
- `workspace/app/.claude/launch.json` (delete the empty file)

**Out of scope** (do NOT touch):

- `go-fmt.compose.yaml`, `docker/` — the container formatter stays.
- Per-package scripts and configs.
- `.github/workflows/*`.
- Deployment sections of README beyond what plan 004 already rewrote (extend,
  don't rewrite).

## Git workflow

- Branch: `docs/agents-onboarding-and-dx`
- One commit per step. Short imperative subjects.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Write `AGENTS.md`

Sections (concise — a screen or two total):

1. **What this is** — monorepo map: the five `workspace/*` packages, one line
   each (app = Vue 3 profile SPA with SSR prerender; domain = shared
   text/sanitize/search logic; store = all content fixtures; llms =
   machine-readable bundle generator writing into app/dist; writing =
   VitePress site for writing.gocanto.sh).
2. **Commands** — the verified table above + per-package `--filter` examples;
   note `pnpm test` (turbo) is the canonical test entry.
3. **Coding style** — 4-space indent (oxfmt), TypeScript-only,
   **class-based OOP for new code; standalone functions only when really
   needed; Vue SFC/composables keep framework idioms**.
4. **Traps** — formatting needs Docker running (`make ui-format`); dev servers
   run behind portless (HTTPS proxy port 1355, first-run local CA; escape
   hatch `pnpm --filter @gocanto/app dev:app` on :5173); llms build writes
   into `workspace/app/dist`; deployment: summarize plan 004's resolved story
   (read the CURRENT README section when writing this — it may have landed).
5. **Content edits** — identity/content lives in `workspace/store`; JSON-LD
   and llms bundle derive from it (post plan 009/011).
   Create `CLAUDE.md` containing exactly: `Read AGENTS.md.`

**Verify**: both files exist; every command quoted in AGENTS.md actually runs
(`pnpm lint`, `pnpm typecheck` exit 0 as you spot-check them).

### Step 2: Makefile cleanup

- Delete the `format-all` target; keep `format`.
- Add a format-only target so formatting doesn't run the whole verify chain:

    ```make
    format-code:
    	pnpm --filter @gocanto/app exec oxlint . --fix
    	$(MAKE) ui-format
    ```

    Keep `format` as the full chain (format-code + lint + typecheck + test) but
    define it as `format: format-code` followed by the three pnpm commands, so
    the duplication is gone. Update the root `package.json` `"format-all"`
    script: remove it (it pointed at the deleted target) — check first with
    `grep -rn "format-all" package.json Makefile README.md`.

- Update `.PHONY` accordingly.

**Verify**: `make format-code` → exit 0 (formats only, no tests run — confirm
by timing/output); `make format` → full chain exits 0;
`grep -c "format-all" Makefile` = 0.

### Step 3: `.editorconfig`

Create at root, mirroring `.oxfmtrc.json`:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 4

[*.{yml,yaml}]
indent_size = 4

[Makefile]
indent_style = tab
```

**Verify**: file exists; `make ui-format` (if Docker available) produces no
diff on a clean tree — i.e. the two configs agree.

### Step 4: README + overrides rationale + cleanup

- README Commands section: add 2–3 sentences on portless (adapted from
  `workspace/writing/README.md:9-24`): what URL `pnpm dev` gives you, the
  first-run CA, and the plain-port escape hatches (`dev:app` :5173 /
  `dev:site` :5175).
- Root `package.json`: pnpm doesn't support JSON comments — document the
  overrides in AGENTS.md's Traps section instead: "pnpm.overrides pins stylus
  and glob to a single major to dedupe transitive fan-out from shadcn-vue /
  vitepress / @vue/test-utils; re-evaluate when those parents bump."
- Delete `workspace/app/.claude/launch.json` (0 bytes, invalid JSON).

**Verify**: `test -s workspace/app/.claude/launch.json` → non-zero exit (file
gone); `grep -n "portless" README.md` ≥ 1;
`grep -n "stylus" AGENTS.md` ≥ 1.

### Step 5: Full gate

**Verify**: `pnpm typecheck && pnpm lint && pnpm test` all exit 0;
`pnpm format:check` → exit 0 on the clean tree (plan 001's gate still green
after Makefile edits — this catches accidental `ui-format` breakage).

## Test plan

No unit tests (docs/config). Verification = the command checks per step, plus
the full gate in Step 5.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `AGENTS.md` exists with the 5 sections; `CLAUDE.md` says "Read AGENTS.md."
- [ ] AGENTS.md records the OOP-first coding constraint
- [ ] `grep -c "format-all" Makefile package.json` = 0 (both files)
- [ ] `make format-code` runs formatter only; `make format` runs the full chain
- [ ] `.editorconfig` exists with indent_size 4 / LF / final newline
- [ ] `workspace/app/.claude/launch.json` deleted
- [ ] README mentions portless in the Commands section
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm format:check` all exit 0

## STOP conditions

Stop and report back (do not improvise) if:

- Something in the repo references `make format-all` or the empty launch.json
  beyond the greps above (search first: `grep -rn "format-all\|launch.json" --include="*.md" --include="*.json" --include="*.yml" . | grep -v node_modules | grep -v plans/`).
- Docker is unavailable so Step 3's config-agreement check can't run — deliver
  anyway and mark that check as pending.
- Plan 004 hasn't landed and the deploy story is still ambiguous — write
  AGENTS.md's deployment paragraph as "see README; two mechanisms exist,
  resolution pending plan 004" rather than guessing.

## Maintenance notes

- AGENTS.md is now the place new traps get recorded — reviewers should ask
  "does AGENTS.md need a line?" on surprising PRs.
- If the formatter ever gets a native (non-Docker) path, update both AGENTS.md
  and README in the same change.
