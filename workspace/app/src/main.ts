import { createApp, createSSRApp } from "vue";

import App from "#app/App.vue";
import "#app/loading.css";
import "#app/styles.css";
import { VitalsInjector } from "#app/lib/vitals-injector";

const factory = import.meta.env.PROD ? createSSRApp : createApp;

factory(App).mount("#app");

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
