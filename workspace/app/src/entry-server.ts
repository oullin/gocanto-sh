import { createSSRApp } from "vue";
import { renderToString } from "@vue/server-renderer";

import App from "#app/App.vue";

export async function render(): Promise<string> {
    return await renderToString(
        createSSRApp(App),
    );
}
