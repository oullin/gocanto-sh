/** Runtime values that determine whether Vercel vitals should be injected. */
export type VitalsEnvironment = {
    readonly prod: boolean;
    readonly protocol: string;
    readonly hostname: string;
};

/** Loads and activates the Vercel vitals integrations. */
export type VitalsLoader = () => Promise<void>;

/** Defers Vercel vitals injection until the browser is idle or the user leaves or interacts. */
export class VitalsInjector {
    private injected = false;

    constructor(
        private readonly loader: VitalsLoader,
        private readonly win: Window & typeof globalThis = window,
        private readonly doc: Document = document,
    ) {}

    /** Determine whether the current build and location permit vitals injection. */
    shouldInject(env: VitalsEnvironment): boolean {
        return (
            env.prod &&
            env.protocol === "https:" &&
            env.hostname !== "localhost" &&
            env.hostname !== "127.0.0.1" &&
            !env.hostname.endsWith(".localhost")
        );
    }

    /** Load the vitals integrations at most once. */
    inject(): void {
        if (this.injected) {
            return;
        }

        this.injected = true;
        void this.loader();
    }

    /** Register deferred and lifecycle triggers when vitals injection is permitted. */
    arm(env: VitalsEnvironment): void {
        if (!this.shouldInject(env)) {
            return;
        }

        const inject = () => this.inject();

        if ("requestIdleCallback" in this.win) {
            this.win.requestIdleCallback(inject, { timeout: 3000 });
        } else {
            globalThis.setTimeout(inject, 1500);
        }

        const once = { once: true, passive: true } as const;

        this.win.addEventListener("pointerdown", inject, once);
        this.win.addEventListener("keydown", inject, once);
        this.win.addEventListener("pagehide", inject, once);

        const handleVisibility = () => {
            if (this.doc.visibilityState === "hidden") {
                this.inject();
                this.doc.removeEventListener("visibilitychange", handleVisibility);
            }
        };

        this.doc.addEventListener("visibilitychange", handleVisibility);
    }
}
