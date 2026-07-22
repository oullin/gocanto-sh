import { createApp, createSSRApp } from "vue";

import App from "#app/App.vue";
import "#app/loading.css";
import "#app/styles.css";
import { VitalsInjector } from "#app/lib/vitals-injector";
import { ConversionTracker } from "#app/lib/conversion-tracker";

const factory = import.meta.env.PROD ? createSSRApp : createApp;

factory(
    App,
    { path: window.location.pathname },
).mount("#app");

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

new ConversionTracker().arm();
