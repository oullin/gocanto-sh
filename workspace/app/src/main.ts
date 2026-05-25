import { createApp, createSSRApp } from "vue";

import App from "@/App.vue";
import "@/loading.css";
import "@/styles.css";

const factory = import.meta.env.PROD ? createSSRApp : createApp;

factory(App).mount("#app");

const injectVercelVitals = () => {
    void Promise.all([import("@vercel/analytics"), import("@vercel/speed-insights")]).then(
        ([analytics, speedInsights]) => {
            analytics.inject();
            speedInsights.injectSpeedInsights();
        },
    );
};

if ("requestIdleCallback" in window) {
    window.requestIdleCallback(injectVercelVitals, { timeout: 4000 });
} else {
    globalThis.setTimeout(injectVercelVitals, 2500);
}
