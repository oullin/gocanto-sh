import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
    cacheDir: "../../storage/.cache/vitest/app",
    plugins: [vue()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
            "@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
            "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
        },
    },
    test: {
        attachmentsDir: "../../storage/.cache/vitest/attachments",
        environment: "happy-dom",
        globals: false,
        include: ["src/**/*.test.ts"],
        isolate: false,
        fileParallelism: false,
        pool: "threads",
    },
});
