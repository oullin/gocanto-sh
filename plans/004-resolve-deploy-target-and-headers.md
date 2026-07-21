# Plan 004: Resolve the deploy-target contradiction and add security headers

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do NOT update `plans/README.md` — the reviewer
> maintains the index.
>
> **Drift check (run first)**: `git diff --stat 7e1c691..HEAD -- README.md vercel.json .github/workflows/pages.yml workspace/app/index.html`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (touches deploy path and response headers of a live site)
- **Depends on**: none (but its Step 1 decision gates Steps 3–4)
- **Category**: security
- **Planned at**: commit `7e1c691`, 2026-07-20
- **Ollin status**: DONE (PR #17 merged as `ba4a69f` incl. user's docs commit `7b0355a`, 2026-07-20; originally approved 2026-07-20; commits `6767503`, `fced5b8`; Vercel confirmed authoritative via live headers; CSP hashes independently recomputed by reviewer)
- **Pull request**: https://github.com/oullin/gocanto-sh/pull/17 (base `chore/security-dependency-bumps`, stacked on #16)
- **Worktree**: /Users/gocanto/.claude/worktrees/gocanto-sh-004-deploy-headers
- **Branch**: `fix/deploy-target-and-headers` (base `df62c9d` = plan 003's PR-READY head)

## Why this matters

The repo tells two different deployment stories. `README.md` documents Vercel
(`vercel deploy --prod --project gocanto-sh --scope oullin`) as the canonical
path, and the domain map says `gocanto.sh` → "Vercel project `gocanto-sh`".
But `.github/workflows/pages.yml` builds `workspace/app/dist` and deploys it to
**GitHub Pages** on every push to `main`. `vercel.json` contains only a
`$schema` line. Meanwhile the site serves inline scripts (theme bootstrap +
JSON-LD) with **no security headers anywhere** — no CSP, no
`X-Content-Type-Options`, no `frame-ancestors`, no HSTS. GitHub Pages cannot
set custom response headers at all, so the headers fix is only implementable
once the real deploy target is confirmed. This plan first establishes the
truth, documents it, and then implements headers on the authoritative target.

## Current state

- `.github/workflows/pages.yml` — full workflow: on `push: branches: [main]`,
  runs `pnpm typecheck && pnpm build`, uploads `workspace/app/dist` via
  `actions/upload-pages-artifact@v5`, deploys with `actions/deploy-pages@v5`
  into the `github-pages` environment. `configure-pages` has
  `enablement: true`.
- `vercel.json` (complete file):

    ```json
    {
        "$schema": "https://openapi.vercel.sh/vercel.json"
    }
    ```

- `README.md` "Vercel operations" section: production deploys target the
  `oullin/gocanto-sh` Vercel project via
  `npx vercel@latest deploy --prod --project gocanto-sh --scope oullin`;
  includes alias-verification and Instant-Rollback recovery instructions. The
  README never mentions the Pages workflow.
- `workspace/app/index.html` head contains two inline `<script>` blocks:
    1. JSON-LD structured data (`<script type="application/ld+json">`, a
       `@graph` with Person + WebSite),
    2. a theme-bootstrap IIFE that reads `localStorage` and sets
       `document.documentElement.dataset.theme`.
       Plus Vercel Analytics/Speed Insights are injected at runtime from
       `workspace/app/src/main.ts` (`import("@vercel/analytics")`,
       `import("@vercel/speed-insights")`) — CSP must allow their script/beacon
       origins (`va.vercel-scripts.com`, `vitals.vercel-insights.com`).
- The site also publishes raw `.md`/`llms.txt`/`sitemap.xml` files from
  `workspace/app/dist` (written by `workspace/llms`), which the README says
  are served "as raw markdown/XML — no SPA fallback". No `_headers`,
  `_redirects`, or vercel `headers`/`rewrites` config exists in the repo.

## Coding style constraint (user-mandated)

New code must be class-based OOP; standalone functions only when really needed.
This plan is config/docs-only; no new TS modules expected.

## Commands you will need

| Purpose      | Command                                    | Expected on success                                             |
| ------------ | ------------------------------------------ | --------------------------------------------------------------- |
| Live headers | `curl -sI https://gocanto.sh/ \| head -30` | shows server (`Vercel` header or `GitHub.com`), current headers |
| Live md file | `curl -sI https://gocanto.sh/profile.md`   | `HTTP/2 200`, `content-type` shows markdown/plain               |
| Build        | `pnpm build`                               | exit 0                                                          |
| Typecheck    | `pnpm typecheck`                           | exit 0                                                          |

## Scope

**In scope** (the only files you should modify):

- `vercel.json` (headers config — only if Vercel is authoritative)
- `README.md` (deployment section corrections)
- `.github/workflows/pages.yml` (only to disable/annotate IF evidence shows
  Pages is vestigial — see STOP conditions first)

**Out of scope** (do NOT touch):

- `workspace/app/index.html` — do NOT restructure the inline scripts in this
  plan (hashes are computed over them as-is; moving them is a different
  change with SEO implications).
- Any DNS/dashboard change — you can only observe, not modify, hosting config.
- The writing site's deployment (`workspace/writing`) — document only.

## Git workflow

- Branch: `fix/deploy-target-and-headers`
- Commit 1: docs reconciliation; Commit 2: headers config. Short imperative subjects.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Determine the authoritative deploy target (evidence, not guesswork)

Run `curl -sI https://gocanto.sh/` and inspect response headers:

- `server: Vercel` / `x-vercel-id` present → Vercel is live.
- `server: GitHub.com` → GitHub Pages is live.

Also run `curl -sI https://gocanto.sh/profile.md` and record the
`content-type` (this documents how raw markdown is actually served today).
Record both outputs verbatim in your report.

**Verify**: you can state, with the header evidence quoted, which platform
serves `gocanto.sh` production traffic.

### Step 2: Reconcile the README

Update the README's deployment documentation to match reality:

- State the authoritative target explicitly at the top of the "Vercel
  operations" (rename if needed) section.
- Add one sentence explaining what `.github/workflows/pages.yml` is for (e.g.
  a fallback/mirror) — or, if Step 1 showed Pages is live, rewrite the section
  around Pages and mark the Vercel instructions as secondary.
- Document where the raw-markdown serving behavior comes from (observed
  `content-type` from Step 1).
- Add a line to the domain map for how `writing.gocanto.sh` deploys (per
  README it is a "Separate Vercel project (VitePress)" — verify with
  `curl -sI https://writing.gocanto.sh/` and note the server header).

**Verify**: `grep -n "GitHub Pages" README.md` returns at least one line; the
deployment section no longer contradicts `pages.yml`'s existence.

### Step 3 (only if Vercel is authoritative): Add security headers to vercel.json

Extend `vercel.json` with a `headers` block applying to `/(.*)`:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains`
- `Content-Security-Policy-Report-Only` (start report-only) along the lines of:
  `default-src 'self'; script-src 'self' 'sha256-<hash1>' 'sha256-<hash2>' https://va.vercel-scripts.com; connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com; img-src 'self' https://oullin.io data:; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'`

    Compute `<hash1>`/`<hash2>` as the base64 SHA-256 of the exact contents of
    the two inline scripts in the **built** `dist/index.html` (the prerender step
    may alter whitespace — hash the built output, not the source). Command shape:
    extract each inline script body and pipe through
    `openssl dgst -sha256 -binary | openssl base64`.
    Note: JSON-LD (`type="application/ld+json"`) is a data block, not executable
    — modern browsers do not require a CSP hash for it, but include its hash
    anyway if testing shows a violation report.

**Verify**: `npx vercel@latest deploy` to a **preview** URL (NOT `--prod`),
then `curl -sI <preview-url>` shows every header above. Confirm in the
preview: page renders, theme toggle works, no CSP violations in the report-only
header's console output when loading the page in a browser.

### Step 4 (only if GitHub Pages is authoritative): meta-tag fallback + report

GitHub Pages cannot set response headers. In that case:

- Do NOT edit `vercel.json`.
- Report that full header hardening requires either moving to Vercel or
  fronting Pages with a proxy; recommend the decision be made by the owner.
- As the only in-repo mitigation, this plan then ends after Step 2 (docs) —
  do not add `<meta http-equiv>` CSP tags without owner sign-off (they are
  partial and can break analytics silently).

**Verify**: report contains the recommendation and the evidence from Step 1.

## Test plan

No unit tests (config/docs change). Verification is live-header inspection:

- Preview deployment shows all five headers (Vercel path), and
- `pnpm build` still exits 0, and the built site loads with zero console
  errors with the report-only CSP active.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] Report quotes `curl -sI https://gocanto.sh/` output and names the live platform
- [ ] README deployment section mentions both mechanisms and which is authoritative
- [ ] If Vercel path: `vercel.json` contains `headers` with the 4 hard headers + report-only CSP, verified on a preview deployment via curl
- [ ] `pnpm build` exits 0
- [ ] No files outside the in-scope list are modified

## STOP conditions

Stop and report back (do not improvise) if:

- Step 1's curl output is ambiguous (e.g. a CDN masks the origin) — report the
  headers you got.
- You are tempted to disable `pages.yml`: deleting/disabling a deploy workflow
  is an owner decision. Propose it in the report; do not do it.
- The preview deployment shows CSP violations from origins not listed in this
  plan — list them verbatim rather than widening the policy ad hoc.
- Deploying a preview requires credentials you don't have — deliver the
  `vercel.json` change with the computed hashes and mark verification as
  pending owner deploy.

## Maintenance notes

- When the CSP has run report-only in production for a while with no
  violations, flip `Content-Security-Policy-Report-Only` to
  `Content-Security-Policy` — deliberate follow-up, not this plan.
- Any new inline script in `index.html` (or a change to the theme bootstrap)
  invalidates the script hashes — the build should eventually compute these
  automatically (candidate future plan).
- If the site ever moves fully to one platform, delete the other path's config
  and docs in the same change.
