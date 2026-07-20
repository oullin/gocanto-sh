# Plan 008: Cut third-party avatar latency and oversized static assets

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do NOT update `plans/README.md` — the reviewer
> maintains the index.
>
> **Drift check (run first)**: `git diff --stat 7e1c691..HEAD -- workspace/app/index.html workspace/domain/src/recommendations.ts workspace/app/public workspace/writing/public`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `7e1c691`, 2026-07-20
- **Ollin status**: DONE (PR #22 merged as `faf922f`, 2026-07-20; post-merge follow-up: drop `crossorigin` from the preconnect — see index)
- **Worktree**: /Users/gocanto/.claude/worktrees/gocanto-sh-008-assets
- **Branch**: `perf/assets-and-preconnect` (base `fced5b8`)
- **Model**: gpt-5.6-sol · **Level**: high · **Harness**: codex CLI 0.144.6 (authenticated)

## Why this matters

The hero's proof row (above the fold) and the testimonial marquee load every
avatar from `https://oullin.io/images/` — a third-party origin with **no
preconnect hint** — so first paint of those images waits on a cold DNS+TLS
handshake the deploy doesn't control. Separately, ~200 KB of static assets are
larger than they need to be: a 47 KB favicon, 35 KB apple-touch-icon, a 305 KB
og-image duplicated in two packages, and a 118 KB `avatar.jpg` referenced only
by JSON-LD.

## Current state

- `workspace/domain/src/recommendations.ts:3` —
  `export const AVATAR_BASE_URL = "https://oullin.io/images/";`
  (consumed to build avatar URLs for testimonials/recommendations).
- `workspace/app/index.html` head — has `modulepreload` links but **no**
  `preconnect`/`dns-prefetch` for `oullin.io` (verified by grep).
- Measured sizes (bytes):
    - `workspace/app/public/favicon.png` — 47,283 (referenced as 192×192 icon)
    - `workspace/app/public/apple-touch-icon.png` — 35,335 (180×180)
    - `workspace/app/public/og-image.png` — 305,454
    - `workspace/writing/public/og-image.png` — 305,454 (byte-identical duplicate)
    - `workspace/app/public/avatar.jpg` — 118,731 (used ONLY as JSON-LD
      `"image": "https://gocanto.sh/avatar.jpg"` in `index.html`; the rendered
      nav avatar is `avatar-128.jpg`, 7,788 bytes)
    - `workspace/writing/public/favicon.png` — 47,283 (same duplicate favicon)
- README documents og-image as deliberately 1200×630.

## Coding style constraint (user-mandated)

New code must be class-based OOP; standalone functions only when really needed.
This plan is assets + one HTML line; no new TS modules expected.

## Commands you will need

| Purpose    | Command                                                | Expected on success             |
| ---------- | ------------------------------------------------------ | ------------------------------- |
| Sizes      | `ls -la workspace/app/public workspace/writing/public` | targets met (see done criteria) |
| Dimensions | `sips -g pixelWidth -g pixelHeight <file>` (macOS)     | unchanged dimensions            |
| Build      | `pnpm build`                                           | exit 0                          |
| Typecheck  | `pnpm typecheck`                                       | exit 0                          |

## Scope

**In scope** (the only files you should modify):

- `workspace/app/index.html` (one `<link rel="preconnect">` line)
- `workspace/app/public/favicon.png`, `apple-touch-icon.png`, `og-image.png`,
  `avatar.jpg` (recompress in place — same filenames, same dimensions)
- `workspace/writing/public/og-image.png`, `favicon.png` (recompress)

**Out of scope** (do NOT touch):

- `AVATAR_BASE_URL` / self-hosting the avatars — that changes content
  ownership and needs the owner to copy image rights/files; recorded as a
  follow-up, not this plan.
- `site.webmanifest`, `robots.txt`.
- Any `<meta>`/JSON-LD content changes.
- `avatar-128.jpg` (already optimal at 7.8 KB).

## Git workflow

- Branch: `perf/assets-and-preconnect`
- Commits: 1) preconnect, 2) asset recompression. Short imperative subjects.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Preconnect to the avatar origin

In `workspace/app/index.html`, immediately before the first `modulepreload`
link (or after the meta tags in `<head>`), add:

```html
<link rel="preconnect" href="https://oullin.io" crossorigin />
```

**Verify**: `grep -n "preconnect" workspace/app/index.html` → 1 match;
`pnpm build` → exit 0.

### Step 2: Recompress assets in place

Keep pixel dimensions identical; only re-encode. Suggested tools (whichever
exists in the environment): `sips`, `pngquant`, `cwebp`+rename is NOT allowed
(filenames must stay). Targets:

- `favicon.png` (both copies): ≤ 12 KB (192×192, palette-quantized PNG is fine)
- `apple-touch-icon.png`: ≤ 12 KB (180×180)
- `og-image.png` (both copies): ≤ 120 KB (1200×630; quantize/optimize —
  visually lossless at social-card scale)
- `avatar.jpg`: ≤ 40 KB (re-encode JPEG quality ~70; it's crawler-only)

If a target can't be met without visible degradation, get as close as
possible and report the achieved size.

**Verify**: `ls -la` shows every file at/below target;
`sips -g pixelWidth -g pixelHeight` unchanged for each; open each image and
confirm no visible banding at intended display size.

### Step 3: Full gate

**Verify**: `pnpm build` → exit 0; `pnpm test` → all pass (no code changed);
built `dist/` contains the recompressed assets (`ls -la workspace/app/dist/*.png` after build).

## Test plan

No unit tests (assets + one HTML line). Verification is the size/dimension
checks above plus a green build.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `grep -c preconnect workspace/app/index.html` = 1
- [ ] favicon.png ≤ 12,288 B (both packages); apple-touch-icon.png ≤ 12,288 B
- [ ] og-image.png ≤ 122,880 B (both packages); avatar.jpg ≤ 40,960 B
- [ ] All recompressed images keep identical pixel dimensions
- [ ] `pnpm build` exits 0; no files outside the in-scope list modified

## STOP conditions

Stop and report back (do not improvise) if:

- No lossless/near-lossless tool is available and quality visibly degrades at
  the target sizes.
- Any consumer references these assets by content hash (grep first:
  `grep -rn "og-image\|apple-touch\|favicon\|avatar.jpg" workspace/app workspace/writing --include="*.html" --include="*.ts" --include="*.vue" --include="*.json"`)
  and the reference would break.

## Maintenance notes

- Self-hosting the oullin.io avatars (and dropping the preconnect) is the
  bigger win — deferred deliberately; needs owner to vendor the images.
- If og-image is ever redesigned, export at ≤ 120 KB from the start and update
  both packages (they are intentionally the same card today).
- Reviewer: verify the preconnect includes `crossorigin` (avatar `<img>`
  requests are anonymous-mode candidates; matching crossorigin avoids a
  second connection).
