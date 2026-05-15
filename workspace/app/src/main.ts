import { createApp, createSSRApp } from "vue";

import App from "@/App.vue";
import "@/loading.css";
import "@/styles.css";

const factory = import.meta.env.PROD ? createSSRApp : createApp;

factory(App).mount("#app");
