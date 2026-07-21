import { computed, effectScope, ref } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
    AsyncInViewController,
    useAsyncInView,
    type AsyncInViewResult,
} from "#app/lib/useAsyncInView";

const intersectionObserver = vi.hoisted(() => {
    class IntersectionObserverHarness {
        readonly stop = vi.fn();
        private callback:
            | ((entries: ReadonlyArray<{ readonly isIntersecting: boolean }>) => void)
            | undefined;

        observe(callback: (entries: ReadonlyArray<{ readonly isIntersecting: boolean }>) => void): {
            readonly stop: ReturnType<typeof vi.fn>;
        } {
            this.callback = callback;

            return { stop: this.stop };
        }

        intersect(): void {
            if (!this.callback) {
                throw new Error("Intersection observer callback was not registered");
            }

            this.callback([{ isIntersecting: true }]);
        }

        reset(): void {
            this.callback = undefined;
            this.stop.mockReset();
        }
    }

    return new IntersectionObserverHarness();
});

vi.mock("@vueuse/core", () => ({
    useIntersectionObserver: (
        _target: unknown,
        callback: (entries: ReadonlyArray<{ readonly isIntersecting: boolean }>) => void,
    ) => intersectionObserver.observe(callback),
}));

class AsyncInViewTestHarness<T> {
    readonly result: AsyncInViewResult<T>;
    private readonly scope = effectScope();

    constructor(loader: () => T | Promise<T>, delayMs = 25) {
        const result = this.scope.run(() =>
            useAsyncInView(
                ref<HTMLElement | null>(null),
                loader,
                { delayMs },
            ),
        );

        if (!result) {
            throw new Error("Async in-view composable did not initialize");
        }

        this.result = result;
    }

    dispose(): void {
        this.scope.stop();
    }
}

describe("useAsyncInView", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        intersectionObserver.reset();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it("tracks controller state reactively across a load", async () => {
        let resolveLoader!: (value: string) => void;

        const controller = new AsyncInViewController(
            () =>
                new Promise<string>((resolve) => {
                    resolveLoader = resolve;
                }),
        );

        const state = computed(() => controller.state);

        expect(state.value).toBe("idle");

        const load = controller.load();

        expect(state.value).toBe("loading");

        resolveLoader("loaded");

        await load;

        expect(state.value).toBe("ready");
    });

    it("does not resolve before intersection", async () => {
        const loader = vi.fn(async () => "loaded");
        const harness = new AsyncInViewTestHarness(loader);

        await vi.advanceTimersByTimeAsync(1_000);

        expect(loader).not.toHaveBeenCalled();
        expect(harness.result.data.value).toBeNull();
        harness.dispose();
    });

    it("resolves once after the configured delay and stops observing", async () => {
        const loader = vi.fn(async () => "loaded");
        const harness = new AsyncInViewTestHarness(loader);

        intersectionObserver.intersect();

        await vi.advanceTimersByTimeAsync(24);

        expect(loader).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(1);

        expect(loader).toHaveBeenCalledTimes(1);
        expect(harness.result.data.value).toBe("loaded");
        expect(intersectionObserver.stop).toHaveBeenCalledTimes(1);
        harness.dispose();
    });

    it("does not load twice after repeated intersections", async () => {
        const loader = vi.fn(async () => "loaded");
        const harness = new AsyncInViewTestHarness(loader);

        intersectionObserver.intersect();
        intersectionObserver.intersect();

        await vi.advanceTimersByTimeAsync(25);

        expect(loader).toHaveBeenCalledTimes(1);
        expect(intersectionObserver.stop).toHaveBeenCalledTimes(1);
        harness.dispose();
    });

    it("contains loader rejection as error state", async () => {
        const loader = vi.fn(async () => Promise.reject(new Error("chunk unavailable")));
        const harness = new AsyncInViewTestHarness(loader);

        intersectionObserver.intersect();

        await vi.advanceTimersByTimeAsync(25);

        expect(loader).toHaveBeenCalledTimes(1);
        expect(harness.result.data.value).toBeNull();
        expect(harness.result.error.value).toBe(true);
        harness.dispose();
    });

    it("retries after failure and stores successful data", async () => {
        const loader = vi
            .fn<() => Promise<string>>()
            .mockRejectedValueOnce(new Error("chunk unavailable"))
            .mockResolvedValueOnce("loaded");

        const harness = new AsyncInViewTestHarness(loader);

        intersectionObserver.intersect();

        await vi.advanceTimersByTimeAsync(25);

        expect(harness.result.error.value).toBe(true);

        harness.result.retry();

        await vi.advanceTimersByTimeAsync(0);

        expect(loader).toHaveBeenCalledTimes(2);
        expect(harness.result.data.value).toBe("loaded");
        expect(harness.result.error.value).toBe(false);
        expect(intersectionObserver.stop).toHaveBeenCalledTimes(1);
        harness.dispose();
    });

    it("cancels the pending load when its scope is disposed", async () => {
        const loader = vi.fn(async () => "loaded");
        const harness = new AsyncInViewTestHarness(loader);

        intersectionObserver.intersect();
        harness.dispose();

        await vi.advanceTimersByTimeAsync(25);

        expect(loader).not.toHaveBeenCalled();
        expect(harness.result.data.value).toBeNull();
    });
});
