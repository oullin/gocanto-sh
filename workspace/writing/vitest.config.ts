import { defineConfig } from "vitest/config";

export default defineConfig({
    cacheDir: "../../storage/.cache/vitest/writing",
    test: {
        attachmentsDir: "../../storage/.cache/vitest/attachments",
        environment: "node",
        globals: false,
        include: [".vitepress/**/*.test.ts"],
        isolate: false,
        fileParallelism: false,
        pool: "threads",
    },
});
