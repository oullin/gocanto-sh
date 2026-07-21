import { ref, type Ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

type Options = {
    /** CSS margin around the root, e.g. "200px". */
    rootMargin?: string;
    /** Min delay after viewport entry before data resolves. */
    delayMs?: number;
};

/**
 * Returns a Ref that resolves to `loader()` only after:
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
): Ref<T | null> {
    // SAFETY: `ref` widens T to UnwrapRef<T>, which is identical for the values
    // this composable loads; the cast restores the caller-facing Ref<T | null>
    // type that Vue cannot infer through the generic.
    const data = ref<T | null>(null) as Ref<T | null>;

    let resolved = false;

    const { stop } = useIntersectionObserver(
    	target,
    	([entry]) => {
    	        if (!entry?.isIntersecting || resolved) {
    	            return;
    	        }

    	        resolved = true;
    	        stop();
    	        window.setTimeout(async () => {
    	            data.value = await loader();
    	        }, delayMs);
    	    },
    	{ rootMargin },
    );

    return data;
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

    const { stop } = useIntersectionObserver(
    	target,
    	([entry]) => {
    	        if (!entry?.isIntersecting || resolved) {
    	            return;
    	        }

    	        resolved = true;
    	        stop();
    	        window.setTimeout(() => {
    	            ready.value = true;
    	        }, delayMs);
    	    },
    	{ rootMargin },
    );

    return ready;
}
