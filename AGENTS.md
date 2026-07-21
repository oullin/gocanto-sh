# Agent guide

## What this is

This pnpm/Turborepo monorepo contains five packages:

- `workspace/app`: Vue 3 profile SPA with SSR prerendering.
- `workspace/domain`: shared text, sanitization, and search logic.
- `workspace/store`: all identity and content fixtures.
- `workspace/llms`: machine-readable bundle generator that writes into `workspace/app/dist`.
- `workspace/writing`: VitePress site for `writing.gocanto.sh`.

## Commands

Run repository-wide checks from the root. `pnpm test` (Turbo) is the canonical test entry point.

| Purpose | Command | Expected result |
| --- | --- | --- |
| Lint | `pnpm lint` | Exit 0 |
| Typecheck | `pnpm typecheck` | Exit 0 |
| Tests | `pnpm test` | All tests pass |
| Format only | `make format-code` | Exit 0 |

Use filters for package-scoped work, for example `pnpm --filter @gocanto/app test` or `pnpm --filter @gocanto/domain typecheck`.

## Coding style

- Use TypeScript only and follow oxfmt's four-space indentation.
- New code must use class-based OOP; use standalone functions only when really needed.
- Vue SFCs and composables should retain their framework idioms.

## Traps

- `make ui-format` requires Docker. `make format-code` formats only; `make format` additionally runs lint, typecheck, and tests.
- `make ui-format` and `make ui-format-check` silently no-op in linked Git worktrees: the formatter container mounts only the checkout, while a worktree's `.git` file points outside it. Run formatter checks from a normal checkout or in CI.
- Dev servers run behind portless, using a shared HTTPS proxy on port 1355 and setting up a local CA on first use. For a plain-port escape hatch, use `pnpm --filter @gocanto/app dev:app` on port 5173 or `pnpm --filter @gocanto/writing dev:site` on port 5175.
- The llms build writes generated files into `workspace/app/dist`; do not treat those outputs as hand-authored source.
- Vercel is authoritative for production. `gocanto.sh` and `writing.gocanto.sh` are separate Vercel projects; the GitHub Pages workflow is a secondary fallback/mirror build check. See the README deployment section before operating either target.
- `pnpm.overrides` pins `stylus` and `glob` to a single major to deduplicate transitive fan-out from shadcn-vue, VitePress, and `@vue/test-utils`; re-evaluate when those parents bump. It also pins `undici` to `~7.28.0`, a security floor kept within jsdom's compatible 7.28.x line. Widening it to `>=` admits undici 8 and breaks jsdom at runtime; revisit when jsdom adopts undici 8.
- Turbo's `test` inputs do not cover `workspace/writing/.vitepress/__tests__/` because that package has no `src/` test location. A local cache can therefore serve stale writing-test results; use `pnpm test --force` when in doubt.

## Content edits

Identity and content live in `workspace/store`. JSON-LD is generated from the store at build time, and the llms bundle derives from the same source; make content changes there rather than patching generated output.
