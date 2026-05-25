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

const injectVercelVitals = () => {
    void Promise.all([import("@vercel/analytics"), import("@vercel/speed-insights")]).then(
        ([analytics, speedInsights]) => {
            analytics.inject();
            speedInsights.injectSpeedInsights();
        },
    );
};

if (shouldInjectVercelVitals() && "requestIdleCallback" in window) {
    window.requestIdleCallback(injectVercelVitals, { timeout: 4000 });
} else if (shouldInjectVercelVitals()) {
    globalThis.setTimeout(injectVercelVitals, 2500);
}
