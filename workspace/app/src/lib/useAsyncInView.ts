import { onScopeDispose, ref, type Ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

type Options = {
    /** CSS margin around the root, e.g. "200px". */
    rootMargin?: string;
    /** Min delay after viewport entry before data resolves. */
    delayMs?: number;
};

/** The lifecycle states of an asynchronous in-view load. */
export type AsyncInViewState = "idle" | "loading" | "ready" | "error";

/** Reactive values and actions exposed by {@link useAsyncInView}. */
export type AsyncInViewResult<T> = {
    readonly data: Ref<T | null>;
    readonly error: Ref<boolean>;
    readonly retry: () => void;
};

/** Owns the load and retry state for asynchronous in-view content. */
export class AsyncInViewController<T> {
    private readonly dataState = ref<T | null>(null) as Ref<T | null>;
    private readonly errorState = ref(false);
    private readonly currentState = ref<AsyncInViewState>("idle");

    /**
     * Create an asynchronous in-view controller.
     *
     * @param loader - Loads the content when the target enters the viewport.
     */
    constructor(private readonly loader: () => T | Promise<T>) {}

    /** The loaded data, or `null` before a successful load. */
    get data(): Ref<T | null> {
        return this.dataState;
    }

    /** Whether the latest load failed. */
    get error(): Ref<boolean> {
        return this.errorState;
    }

    /** The current load lifecycle state. */
    get state(): AsyncInViewState {
        return this.currentState.value;
    }

    /** Load the content while containing expected loader failures as state. */
    async load(): Promise<void> {
        if (this.currentState.value === "loading") {
            return;
        }

        this.currentState.value = "loading";
        this.dataState.value = null;
        this.errorState.value = false;

        try {
            this.dataState.value = await this.loader();

            this.currentState.value = "ready";
        } catch {
            this.currentState.value = "error";
            this.errorState.value = true;
        }
    }

    /** Retry the loader directly without re-arming viewport observation. */
    retry(): Promise<void> {
        return this.load();
    }
}

/**
 * Returns reactive load state that resolves `data` to `loader()` only after:
 *   1. The component has mounted (never on first paint).
 *   2. The `target` element has entered (or is near) the viewport.
 *   3. An optional micro-delay has elapsed (lets skeletons render at least one frame).
 *
 * Once resolved, the observer disconnects.
 */
export function useAsyncInView<T>(
    target: Ref<HTMLElement | null>,
    loader: () => T | Promise<T>,
    { rootMargin = "200px", delayMs = 200 }: Options = {},
): AsyncInViewResult<T> {
    const controller = new AsyncInViewController(loader);

    let resolved = false;
    let timerId: number | undefined;

    const { stop } = useIntersectionObserver(
        target,
        ([entry]) => {
                if (!entry?.isIntersecting || resolved) {
                    return;
                }

                resolved = true;
                stop();
                timerId = window.setTimeout(() => {
                    void controller.load();
                }, delayMs);
            },
        { rootMargin },
    );

    onScopeDispose(() => {
        if (timerId !== undefined) {
            window.clearTimeout(timerId);
        }
    });

    return {
        data: controller.data,
        error: controller.error,
        retry: () => {
            void controller.retry();
        },
    };
}

/**
 * Like {@link useAsyncInView}, but flips a boolean once visible. Use when you
 * already have the data synchronously and only need a "ready to reveal" signal
 * to drive the skeleton-to-content transition.
 */
export function useInViewReady(
    target: Ref<HTMLElement | null>,
    { rootMargin = "200px", delayMs = 200 }: Options = {},
): Ref<boolean> {
    const ready = ref(false);

    let resolved = false;
    let timerId: number | undefined;

    const { stop } = useIntersectionObserver(
        target,
        ([entry]) => {
                if (!entry?.isIntersecting || resolved) {
                    return;
                }

                resolved = true;
                stop();
                timerId = window.setTimeout(() => {
                    ready.value = true;
                }, delayMs);
            },
        { rootMargin },
    );

    onScopeDispose(() => {
        if (timerId !== undefined) {
            window.clearTimeout(timerId);
        }
    });

    return ready;
}
