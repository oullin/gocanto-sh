import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
    base: process.env.GITHUB_ACTIONS ? "/gocanto-sh/" : "/",
    cacheDir: "../../storage/.cache/vite/app",
    plugins: [vue()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
            "@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
        },
    },
});
