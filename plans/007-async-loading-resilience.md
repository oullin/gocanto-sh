# Plan 007: Make lazy-loaded sections recover from chunk-load failures

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do NOT update `plans/README.md` — the reviewer
> maintains the index.
>
> **Drift check (run first)**: `git diff --stat 7e1c691..HEAD -- workspace/app/src/lib/useAsyncInView.ts workspace/app/src/components/GlobalSearch.vue workspace/app/src/components/RecommendationsMarquee.vue workspace/app/src/components/ProjectsTable.vue`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW (adds error paths; happy path untouched)
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `7e1c691`, 2026-07-20
- **Ollin status**: READY FOR PR (approved 2026-07-20; commits `0ab5b8a`, `b8580f8`, `788ddac`, `76eaed7`; build gate run by reviewer, exit 0)
- **Worktree**: /Users/gocanto/.claude/worktrees/gocanto-sh-007-async-resilience
- **Branch**: `fix/async-loading-resilience` (base `fced5b8`)
- **Model**: gpt-5.6-sol · **Level**: high · **Harness**: codex CLI 0.144.6 (authenticated)

## Why this matters

Both lazily-loaded content surfaces fail silently and permanently when a
dynamic-import chunk fails (network blip, stale deploy, cache mismatch):
the ⌘K search palette renders a working input with zero results and **no
message** (its `catch` swallows the error and the results list — including the
"No matches" empty state — is gated on `v-if="corpus"`); the testimonials
marquee sticks in its loading skeleton forever and logs an unhandled promise
rejection (the observer is already stopped, so no retry ever happens). Also,
`ProjectsTable` stacks overlapping 220 ms timers on rapid filter toggles.

## Current state

- `workspace/app/src/lib/useAsyncInView.ts:27-41` — after first intersection:

    ```ts
    resolved = true;
    stop();
    window.setTimeout(async () => {
        data.value = await loader(); // rejection → unhandled, data stays null
    }, delayMs);
    ```

    `useInViewReady` (same file, lines 51-75) has the same shape but no loader.

- `workspace/app/src/components/GlobalSearch.vue:79-91` — corpus load:

    ```ts
    corpusLoading = true;
    void buildCorpus()
        .then((nextCorpus) => {
            corpus.value = nextCorpus;
            corpusLoading = false;
        })
        .catch(() => {
            corpusLoading = false;
        }); // swallowed
    ```

    and the template (line 168-189): `<CommandList><template v-if="corpus">…`
    wraps both `CommandEmpty` and the result groups — nothing renders when
    corpus is null.

- `workspace/app/src/components/RecommendationsMarquee.vue:13-18,35`:

    ```ts
    const recommendationsFixture = useAsyncInView(section, async () => {
        const store = await import("@gocanto/store/recommendations");
        return store.recommendations;
    });
    // …
    const loading = computed(() => recommendationsFixture.value === null);
    ```

- `workspace/app/src/components/ProjectsTable.vue:50-59`:

    ```ts
    watch(
        selected,
        () => {
            filtering.value = true;
            window.setTimeout(() => {
                filtering.value = false;
            }, 220);
        },
        { deep: true },
    );
    ```

Conventions: Vue 3 `<script setup lang="ts">`, composables in `src/lib/`,
4-space indent, tests as `src/**/*.test.ts` with explicit vitest imports
(pattern: `workspace/app/src/lib/utils.test.ts`).

## Coding style constraint (user-mandated)

New code must be class-based OOP; standalone functions only when really needed.
Vue composables must remain functions (framework idiom — reactivity binds to
`setup()` scope), but structure the retry/error state machine inside
`useAsyncInView` as a small exported class (e.g. `AsyncInViewController`
holding `state: "idle" | "loading" | "ready" | "error"`, `load()`, `retry()`)
that the composable instantiates. That gives the mandated OOP shape AND makes
the logic unit-testable without a component.

## Commands you will need

| Purpose   | Command                              | Expected on success                             |
| --------- | ------------------------------------ | ----------------------------------------------- |
| App tests | `pnpm --filter @gocanto/app test`    | all pass                                        |
| Typecheck | `pnpm typecheck`                     | exit 0                                          |
| Build     | `pnpm build`                         | exit 0                                          |
| Dev       | `pnpm --filter @gocanto/app dev:app` | vite dev on :5173 (manual check only if needed) |

## Suggested executor toolkit

- Read `/Users/gocanto/Sites/skills/.agents/skills/typescript-coding-standards/SKILL.md`
  fully before writing any `.ts`/`.vue` file; treat it as binding.

## Scope

**In scope** (the only files you should modify/create):

- `workspace/app/src/lib/useAsyncInView.ts`
- `workspace/app/src/lib/useAsyncInView.test.ts` (create)
- `workspace/app/src/components/GlobalSearch.vue`
- `workspace/app/src/components/RecommendationsMarquee.vue`
- `workspace/app/src/components/ProjectsTable.vue`

**Out of scope** (do NOT touch):

- `workspace/app/src/components/GlobalSearchLoader.vue` — the lazy mount of
  the dialog itself is fine.
- `workspace/domain/src/search.ts` / corpus building logic.
- Visual design of error states — plain text + retry button using existing
  classes; no new CSS files.
- The GlobalSearch `sheetOpen` re-highlight timer (lines 112-145) — leave
  as-is; it's cosmetic and self-contained.

## Git workflow

- Branch: `fix/async-loading-resilience`
- One commit per step. Short imperative subjects.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Error/retry state in `useAsyncInView`

Rework `useAsyncInView` to return `{ data, error, retry }` (keep returning the
same `data` ref as before for compatibility — change the return type to an
object; update its two consumers in this same plan). Internals via the
`AsyncInViewController` class described above:

- loader rejection → `error.value = true` (or the caught error), `data` stays
  null, NO unhandled rejection (`try/catch` inside the timer callback).
- `retry()` → clears error, calls the loader again (direct call — the element
  is already in view; do not re-arm the observer).
- cancel the pending `setTimeout` in `onScopeDispose` (import from vue) for
  both `useAsyncInView` and `useInViewReady`.

`useInViewReady`'s public API is unchanged (boolean ref) — it only gains the
dispose-time `clearTimeout`.

**Verify**: `pnpm typecheck` → exit 0 (this will flag the consumers to update).

### Step 2: Consumers render failure states

- `RecommendationsMarquee.vue`: destructure `{ data: recommendationsFixture, error, retry }`.
  `loading` becomes `fixture === null && !error`. When `error` is truthy,
  render (in place of the marquee) a short inline message with a retry button:
  "Couldn't load testimonials." + `<button type="button" @click="retry">Retry</button>`.
- `GlobalSearch.vue`: add `const corpusError = ref(false)`; set it in the
  `.catch`, clear it before retrying. In the template, inside `CommandList`,
  add `<template v-else-if="corpusError">` (sibling of the `v-if="corpus"`
  block) with the same message + retry pattern; retry re-runs the corpus load
  (extract the load body into a local `loadCorpus()` so both the watcher and
  the retry button call it).

**Verify**: `pnpm --filter @gocanto/app test` passes;
`pnpm typecheck` → exit 0.

### Step 3: ProjectsTable timer hygiene

Store the timer id; `clearTimeout` before starting a new one and in
`onBeforeUnmount`:

```ts
let filterTimer: number | undefined;
watch(
    selected,
    () => {
        filtering.value = true;
        window.clearTimeout(filterTimer);
        filterTimer = window.setTimeout(() => {
            filtering.value = false;
        }, 220);
    },
    { deep: true },
);
onBeforeUnmount(() => window.clearTimeout(filterTimer));
```

**Verify**: `pnpm typecheck` → exit 0.

### Step 4: Tests for the controller/composable

`workspace/app/src/lib/useAsyncInView.test.ts` with fake timers, mocking
`@vueuse/core`'s `useIntersectionObserver` (capture the callback, return a
`stop` spy). Cases:

1. no resolve before intersection;
2. resolves once after `delayMs`, `stop()` called once;
3. repeat intersections don't double-load;
4. loader rejection → `error` set, no unhandled rejection (assert via
   `process.on("unhandledRejection")` guard or vitest's default failure);
5. `retry()` after failure → loader called again, success populates `data`
   and clears `error`;
6. scope dispose before timer fires → loader never called (use
   `effectScope()` from vue to run/stop the composable).

**Verify**: `pnpm --filter @gocanto/app test` → all pass, ≥6 new cases.

### Step 5: Full gate + SSR safety

**Verify**: `pnpm build` → exit 0 (new template branches must be SSR-safe —
they are static markup); `pnpm lint` → exit 0; `pnpm test` → all pass.

## Test plan

Step 4's six controller cases are the core. Component-level error rendering is
covered by typecheck + build; if a quick component test is cheap, add one for
GlobalSearch showing the error branch when `corpusError` is true (pattern:
`workspace/app/src/components/__tests__/GlobalSearch.test.ts`).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `useAsyncInView` returns `{ data, error, retry }`; no unhandled rejection on loader failure (test 4 proves it)
- [ ] GlobalSearch template has an error branch (`grep -n "corpusError" workspace/app/src/components/GlobalSearch.vue` ≥ 2 matches)
- [ ] Marquee renders retry affordance on error (grep "Retry" in the component)
- [ ] `grep -n "clearTimeout" workspace/app/src/components/ProjectsTable.vue` ≥ 2 matches
- [ ] ≥6 new composable tests pass; `pnpm typecheck && pnpm lint && pnpm test && pnpm build` all exit 0
- [ ] No files outside the in-scope list are modified

## STOP conditions

Stop and report back (do not improvise) if:

- Changing `useAsyncInView`'s return shape breaks a consumer NOT listed in
  scope (search first: `grep -rn "useAsyncInView" workspace/app/src`).
- Mocking `useIntersectionObserver` proves impossible without restructuring
  the composable further than described.
- The GlobalSearch error branch requires touching reka-ui internals.

## Maintenance notes

- Any new lazily-imported section should use `useAsyncInView` and get the
  error/retry behavior for free — note this in the component when adding.
- Reviewer: confirm the retry path doesn't re-register the intersection
  observer (double-observer bug) and that `{ once: true }` semantics of the
  original resolve are preserved.
