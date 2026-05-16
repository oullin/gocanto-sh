import { createApp, createSSRApp } from "vue";
import { inject as injectAnalytics } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

import App from "@/App.vue";
import "@/loading.css";
import "@/styles.css";

const factory = import.meta.env.PROD ? createSSRApp : createApp;

factory(App).mount("#app");

injectAnalytics();
injectSpeedInsights();
