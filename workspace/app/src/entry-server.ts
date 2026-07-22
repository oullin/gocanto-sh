import { createSSRApp } from "vue";
import { renderToString } from "@vue/server-renderer";

import App from "#app/App.vue";

export async function render(path = "/"): Promise<string> {
    const app = createSSRApp(
        App,
        { path },
    );

    return await renderToString(app);
}
