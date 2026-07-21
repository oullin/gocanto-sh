# Plan 009: Emit bio.md in the machine-readable bundle

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do NOT update `plans/README.md` — the reviewer
> maintains the index.
>
> **Drift check (run first)**: `git diff --stat 7e1c691..HEAD -- workspace/llms/src workspace/store/src/bio.ts workspace/store/src/index.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW (additive output)
- **Depends on**: none (execute BEFORE plan 010, which rewires this generator)
- **Category**: direction
- **Planned at**: commit `7e1c691`, 2026-07-20
- **Ollin status**: DONE (PR #20 merged as `f126e77`, 2026-07-20; post-merge follow-up: de-literalize two bio-test assertions — see index)
- **Worktree**: /Users/gocanto/.claude/worktrees/gocanto-sh-009-bio
- **Branch**: `feat/llms-bio` (base `fced5b8`)
- **Model**: gpt-5.6-sol · **Level**: high · **Harness**: codex CLI 0.144.6 (authenticated)

## Why this matters

The site's stated differentiator (README) is publishing "machine-readable
markdown bundles so LLM agents can read the same content without scraping".
The store exports a `bio` fixture — the richest narrative on the site,
including the `quick_facts` "Open to: Fractional CTO · Architecture reviews ·
Select full-time" and "Not open to" signals a recruiter/founder agent would
most act on — and the app renders it (WhoIAm section). But the llms generator
never emits it: agents reading the bundle get a strictly poorer view than
human visitors. This plan adds `bio.md`, wires it into `index.md`, `llms.txt`,
and the sitemap.

## Current state

- `workspace/store/src/bio.ts` — `bio` fixture: `data.tagline`, `data.note`,
  `data.paragraphs` (4 strings containing `<em>` HTML), `data.quick_facts`
  (array of `{ key, value }`). Exported from `workspace/store/src/index.ts:1`
  (`export { bio } from "#store/bio";`), types `BioFixture`/`BioRecord`/
  `BioQuickFact` exported from `#store/types`.
- `workspace/llms/src/generate-markdown.ts` — writes, via a local
  `write(name, body)` helper into `../../app/dist`: `profile.md`,
  `experience.md`, `projects.md`, `education.md`, `talks.md`,
  `recommendations.md`, `links.md`, then `index.md` (via `formatAll({...})`),
  `llms.txt` (via `renderLlmsTxt(SITE_URL, profile)`), `sitemap.xml`. Final
  log: `wrote 8 markdown files, llms.txt, and sitemap.xml`. **No bio import.**
- `workspace/llms/src/formatters.ts` — formatter convention (match it):
  exported arrow functions `formatProfile(fixture)` etc. building a
  `sections: string[]` joined with `"\n"`; HTML stripped via
  `stripHtml` from `@gocanto/domain/text` (see `renderSkill`, which calls
  `stripHtml(skill.description)`); `formatAll` aggregates sections.
- `workspace/llms/src/llms-txt.ts` — template listing section links
  (`- [Profile & skills](${siteUrl}/profile.md)` …).
- `workspace/llms/src/sitemap.ts:8-17` — `MD_PAGES` const array of the 8
  `.md` filenames.
- Tests: `workspace/llms/src/__tests__/` — 22 tests covering formatters,
  llms-txt, sitemap; use them as the structural pattern.

## Coding style constraint (user-mandated)

New code must be class-based OOP; standalone functions only when really needed.
Implement the bio formatter as a class `BioFormatter` (e.g. constructor takes
the `BioFixture`, method `format(): string`) in a new file, exported alongside
a thin `formatBio` wrapper ONLY if `formatAll`'s call-shape symmetry demands
one line of glue. Do not rewrite the existing arrow-function formatters.

## Commands you will need

| Purpose    | Command                             | Expected on success            |
| ---------- | ----------------------------------- | ------------------------------ |
| llms tests | `pnpm --filter @gocanto/llms test`  | all pass                       |
| Build llms | `pnpm --filter @gocanto/llms build` | writes files, log line updated |
| Full build | `pnpm build`                        | exit 0                         |
| Typecheck  | `pnpm typecheck`                    | exit 0                         |

## Suggested executor toolkit

- Read `/Users/gocanto/Sites/skills/.agents/skills/typescript-coding-standards/SKILL.md`
  fully before writing any `.ts` file; treat it as binding.

## Scope

**In scope** (the only files you should modify/create):

- `workspace/llms/src/bio-formatter.ts` (create — the `BioFormatter` class)
- `workspace/llms/src/__tests__/bio-formatter.test.ts` (create)
- `workspace/llms/src/generate-markdown.ts` (import bio, write `bio.md`, update log)
- `workspace/llms/src/formatters.ts` (ONLY if wiring bio into `formatAll` — add
  the bio section to the combined index.md)
- `workspace/llms/src/llms-txt.ts` (add the bio link line)
- `workspace/llms/src/sitemap.ts` (add `"bio.md"` to `MD_PAGES`)
- Existing llms tests that assert page lists/counts (update expectations)

**Out of scope** (do NOT touch):

- `workspace/store/**` — the fixture is complete as-is.
- `README.md` — the file list update belongs to whoever lands this (note it in
  your report; plan 013 owns doc sweeps).
- The generator's output directory / build wiring — plan 010's job.

## Git workflow

- Branch: `feat/llms-bio`
- One commit. Short imperative subject, e.g. "Emit bio.md in the llms bundle".
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: `BioFormatter`

Create `workspace/llms/src/bio-formatter.ts`. Output shape (match existing
formatter voice — headings + lists, HTML stripped with `stripHtml`):

```markdown
# Bio — <name from profile is NOT available here; title the doc "Bio">

> <tagline>

<note>

## Story

<paragraphs, stripHtml'd, blank-line separated>

## Quick facts

- **<key>:** <value> (one line per quick_facts entry)
```

Class contract: `new BioFormatter(bio).format()` returns the markdown ending
without trailing blank padding (the generator's `write` adds the final
newline).

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: Wire into the bundle

- `generate-markdown.ts`: `import { bio } from "@gocanto/store";` and add
  `write("bio.md", new BioFormatter(bio).format());` next to the other section
  writes; update the log line to `wrote 9 markdown files, llms.txt, and sitemap.xml`.
- `formatAll` (in `formatters.ts`): include the bio section in `index.md`
  (accept the bio fixture through its existing options object — extend the
  parameter type; place Bio after Profile).
- `llms-txt.ts`: add `- [Bio](${siteUrl}/bio.md)` to the Sections list.
- `sitemap.ts`: add `"bio.md"` to `MD_PAGES`.
- Also update `generate-markdown.ts`'s `formatAll({...})` call site with `bio`.

**Verify**: `pnpm --filter @gocanto/llms build` → log says 9 markdown files;
`ls workspace/app/dist/bio.md` exists;
`grep -c "bio.md" workspace/app/dist/sitemap.xml` = 1;
`grep -c "bio.md" workspace/app/dist/llms.txt` = 1;
`grep -c "## Quick facts" workspace/app/dist/index.md` = 1.
(Note: the llms build requires `workspace/app/dist` to exist — run
`pnpm build` once first if it doesn't.)

### Step 3: Tests

`bio-formatter.test.ts` (model after existing `__tests__` files): tagline
rendered as blockquote; `<em>` stripped from paragraphs (assert no `<` in
output); every quick_facts key present; "Open to" line present. Update any
existing sitemap/llms-txt tests that pin the page list to include `bio.md`.

**Verify**: `pnpm --filter @gocanto/llms test` → all pass (existing 22 + new).

### Step 4: Full gate

**Verify**: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` all exit 0.

## Test plan

Step 3 covers it; pattern files: `workspace/llms/src/__tests__/*`. Key
regression: sitemap and llms.txt page lists now include bio.md and their
existing tests still enumerate correctly.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] After `pnpm build`: `workspace/app/dist/bio.md` exists, contains "Quick facts" and no raw HTML tags
- [ ] `bio.md` listed in built `llms.txt` and `sitemap.xml`; bio section present in `index.md`
- [ ] Generator log says "wrote 9 markdown files"
- [ ] `pnpm --filter @gocanto/llms test` green including new BioFormatter tests
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all exit 0
- [ ] No files outside the in-scope list modified

## STOP conditions

Stop and report back (do not improvise) if:

- `formatAll`'s signature change ripples beyond `formatters.ts` +
  `generate-markdown.ts` + its test.
- `stripHtml` mangles the `<em>` content (e.g. drops words) — report the
  exact input/output pair.
- Plan 010 already landed and moved the generator — re-read the moved files
  and apply the same change there only if the structure is recognizably the
  same; otherwise stop.

## Maintenance notes

- New store sections should follow this same checklist: formatter + write call
    - formatAll + llms.txt + MD_PAGES (a future refactor could derive all five
      from one registry — noted for plan 010's reviewer).
- README's published-files list should gain `bio.md` (flag in PR description).
