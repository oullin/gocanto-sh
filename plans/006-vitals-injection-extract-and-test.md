# Plan 006: Extract the Vercel vitals injection into a testable class and cover it

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do NOT update `plans/README.md` — the reviewer
> maintains the index.
>
> **Drift check (run first)**: `git diff --stat 7e1c691..HEAD -- workspace/app/src/main.ts`
> If `main.ts` changed since this plan was written, compare the "Current
> state" excerpt against the live code before proceeding; on a mismatch, treat
> it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW-MED (touches production analytics bootstrapping)
- **Depends on**: plans/005-critical-path-tests.md (recommended — establishes test patterns)
- **Category**: tests
- **Planned at**: commit `7e1c691`, 2026-07-20
- **Ollin status**: READY FOR PR (approved 2026-07-20; commits `dfc5b50` (steps 1-2, parent-committed after reviewed sandbox commit failure), `e291b77` (tests); 23/23 tests + real build gate verified by reviewer)
- **Worktree**: /Users/gocanto/.claude/worktrees/gocanto-sh-006-vitals
- **Branch**: `test/vitals-injector` (base `fced5b8`)
- **Model**: gpt-5.6-sol · **Level**: high · **Harness**: codex CLI 0.144.6 (authenticated)

## Why this matters

The vitals-injection logic in `main.ts` has regressed twice (commits `4f5333a`
"Make Vercel vitals injection resilient to short sessions" and `99d6465`
"Detach visibilitychange listener after vitals inject") and has zero tests —
because it is untestable as written: everything runs as top-level side effects
at module import, alongside the app mount. A third regression would ship
invisibly and only surface as drifting production telemetry. This plan moves
the logic into an injectable class and pins its behavior (gating truth table,
idempotency, listener detachment) with unit tests.

## Current state

`workspace/app/src/main.ts` (complete, 67 lines) — the parts to extract:

```ts
const shouldInjectVercelVitals = () => {
    const hostname = window.location.hostname;

    return (
        import.meta.env.PROD &&
        window.location.protocol === "https:" &&
        hostname !== "localhost" &&
        hostname !== "127.0.0.1" &&
        !hostname.endsWith(".localhost")
    );
};

let vitalsInjected = false;

const injectVercelVitals = () => {
    if (vitalsInjected) return; // idempotency flag
    vitalsInjected = true;
    void Promise.all([import("@vercel/analytics"), import("@vercel/speed-insights")]).then(
        ([analytics, speedInsights]) => {
            analytics.inject();
            speedInsights.injectSpeedInsights();
        },
    );
};

if (shouldInjectVercelVitals()) {
    if ("requestIdleCallback" in window) {
        window.requestIdleCallback(injectVercelVitals, { timeout: 3000 });
    } else {
        globalThis.setTimeout(injectVercelVitals, 1500);
    }

    const once = { once: true, passive: true } as const;
    window.addEventListener("pointerdown", injectVercelVitals, once);
    window.addEventListener("keydown", injectVercelVitals, once);
    window.addEventListener("pagehide", injectVercelVitals, once);

    // visibilitychange can't use { once: true } (fires on hidden→visible too)
    const handleVisibility = () => {
        if (document.visibilityState === "hidden") {
            injectVercelVitals();
            document.removeEventListener("visibilitychange", handleVisibility);
        }
    };
    document.addEventListener("visibilitychange", handleVisibility);
}
```

The file also mounts the app (`factory(App).mount("#app")`) — that part stays
in `main.ts` untouched.

Test conventions: vitest, `environment: "happy-dom"`, explicit imports (no
globals) — see `workspace/app/src/lib/utils.test.ts` for the pattern. The app
vitest `include` is `src/**/*.test.ts`.

## Coding style constraint (user-mandated)

New code must be class-based OOP; standalone functions only when really needed.
This plan's core deliverable IS a class — see Step 1.

## Commands you will need

| Purpose   | Command                           | Expected on success |
| --------- | --------------------------------- | ------------------- |
| App tests | `pnpm --filter @gocanto/app test` | all pass            |
| Typecheck | `pnpm typecheck`                  | exit 0              |
| Build     | `pnpm build`                      | exit 0              |
| Lint      | `pnpm lint`                       | exit 0              |

## Suggested executor toolkit

- Read `/Users/gocanto/Sites/skills/.agents/skills/typescript-coding-standards/SKILL.md`
  fully before writing any `.ts` file; treat it as binding.

## Scope

**In scope** (the only files you should modify/create):

- `workspace/app/src/lib/vitals-injector.ts` (create)
- `workspace/app/src/lib/vitals-injector.test.ts` (create)
- `workspace/app/src/main.ts` (replace inline logic with class usage)

**Out of scope** (do NOT touch):

- The app-mount lines of `main.ts` (`factory(App).mount("#app")` and CSS imports).
- `@vercel/analytics` / `@vercel/speed-insights` usage semantics — the same
  two dynamic imports, same call order.
- Any component file.

## Git workflow

- Branch: `test/vitals-injector`
- Commits: 1) extract class + wire main.ts, 2) tests. Short imperative subjects.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create the `VitalsInjector` class

`workspace/app/src/lib/vitals-injector.ts` — design:

```ts
export type VitalsEnvironment = {
    prod: boolean;
    protocol: string;
    hostname: string;
};

export type VitalsLoader = () => Promise<void>;

export class VitalsInjector {
    private injected = false;

    constructor(
        private readonly loader: VitalsLoader,
        private readonly win: Window & typeof globalThis = window,
        private readonly doc: Document = document,
    ) {}

    shouldInject(env: VitalsEnvironment): boolean {
        /* same 5-condition gate */
    }

    inject(): void {
        /* idempotent: flips this.injected, calls loader once */
    }

    arm(env: VitalsEnvironment): void {
        /* no-op when shouldInject(env) is false; otherwise registers:
           requestIdleCallback-or-setTimeout, the three { once: true } listeners,
           and the self-detaching visibilitychange handler — logic identical to
           the current main.ts block, using this.win / this.doc */
    }
}
```

Behavior must be exactly today's: same gate conditions, same timeout values
(3000 idle timeout / 1500 fallback), same events, same `{ once: true, passive: true }`
options, same visibilitychange self-detach.

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: Rewire `main.ts`

Replace the extracted block with:

```ts
import { VitalsInjector } from "@lib/vitals-injector";

const injector = new VitalsInjector(async () => {
    const [analytics, speedInsights] = await Promise.all([
        import("@vercel/analytics"),
        import("@vercel/speed-insights"),
    ]);
    analytics.inject();
    speedInsights.injectSpeedInsights();
});

injector.arm({
    prod: import.meta.env.PROD,
    protocol: window.location.protocol,
    hostname: window.location.hostname,
});
```

(`import.meta.env.PROD` must stay in `main.ts` — it's compile-time.)

**Verify**: `pnpm build` → exit 0; `pnpm --filter @gocanto/app test` → existing
tests still pass.

### Step 3: Tests

`workspace/app/src/lib/vitals-injector.test.ts` with `vi.useFakeTimers()` and
a fake `win`/`doc` (plain objects with `addEventListener`/`removeEventListener`
spies, controllable `visibilityState`) covering:

1. **Gating truth table** for `shouldInject`: prod+https+real-host → true;
   each of {not prod, http:, localhost, 127.0.0.1, foo.localhost} → false.
2. **Idempotency**: `inject()` twice → loader called once.
3. **arm() when gated off**: no listeners registered, no timers.
4. **Idle trigger**: with a fake `requestIdleCallback`, callback fires →
   loader called.
5. **Fallback timer**: without `requestIdleCallback` on the fake window,
   advancing timers 1500ms → loader called once.
6. **Interaction triggers**: simulate the stored `pointerdown` handler →
   loader called once even if `keydown` fires after.
7. **visibilitychange**: visible→ no call; set `visibilityState = "hidden"`,
   fire handler → loader called AND `removeEventListener("visibilitychange", …)`
   spy called (the self-detach — this is regression `99d6465`).

**Verify**: `pnpm --filter @gocanto/app test` → all pass including 7+ new cases.

## Test plan

Covered in Step 3 — 7 named cases, modeled on
`workspace/app/src/lib/utils.test.ts` structure. Final gate: `pnpm test` green.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `workspace/app/src/lib/vitals-injector.ts` exports class `VitalsInjector`
- [ ] `grep -c "addEventListener" workspace/app/src/main.ts` returns 0
- [ ] New test file runs ≥7 cases, all green in `pnpm --filter @gocanto/app test`
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all exit 0
- [ ] No files outside the in-scope list are modified

## STOP conditions

Stop and report back (do not improvise) if:

- `main.ts` no longer matches the "Current state" excerpt (drift).
- Preserving exact behavior requires the class to read `import.meta.env`
  directly (it must not — env is passed in; if you can't make that work, stop).
- Bundle output changes beyond the expected refactor (e.g. analytics chunks
  disappear from `dist/assets/` after `pnpm build`).

## Maintenance notes

- Future analytics changes should extend `VitalsInjector`, not re-inline logic
  in `main.ts`; the truth-table test is the regression net for commits like
  `4f5333a`/`99d6465`.
- Reviewer: diff the arm() logic line-by-line against the old main.ts block —
  the point is extraction, not redesign; any semantic delta is a bug.
