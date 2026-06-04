import { createApp, createSSRApp } from "vue";

import App from "@/App.vue";
import "@/loading.css";
import "@/styles.css";

const factory = import.meta.env.PROD ? createSSRApp : createApp;

factory(App).mount("#app");

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
    if (vitalsInjected) {
        return;
    }

    vitalsInjected = true;

    void Promise.all([import("@vercel/analytics"), import("@vercel/speed-insights")]).then(
        ([analytics, speedInsights]) => {
            analytics.inject();
            speedInsights.injectSpeedInsights();
        },
    );
};

if (shouldInjectVercelVitals()) {
    // Defer past the critical render path, but guarantee the beacon still fires
    // for short or bouncing sessions (common on mobile) by also flushing on the
    // first interaction and before the page is hidden. injectVercelVitals is
    // idempotent, so whichever trigger wins, it only runs once.
    if ("requestIdleCallback" in window) {
        window.requestIdleCallback(injectVercelVitals, { timeout: 3000 });
    } else {
        globalThis.setTimeout(injectVercelVitals, 1500);
    }

    const once = { once: true, passive: true } as const;

    window.addEventListener("pointerdown", injectVercelVitals, once);
    window.addEventListener("keydown", injectVercelVitals, once);
    window.addEventListener("pagehide", injectVercelVitals, once);

    // visibilitychange can't use { once: true } (it also fires on hidden→visible),
    // so guard on the hidden state and detach manually once it has injected.
    const handleVisibility = () => {
        if (document.visibilityState === "hidden") {
            injectVercelVitals();
            document.removeEventListener("visibilitychange", handleVisibility);
        }
    };

    document.addEventListener("visibilitychange", handleVisibility);
}
