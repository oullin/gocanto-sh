import { defineConfig } from "vitest/config";

export default defineConfig({
    cacheDir: "../../storage/.cache/vitest/domain",
    test: {
        attachmentsDir: "../../storage/.cache/vitest/attachments",
        environment: "node",
        globals: false,
        include: ["src/**/*.test.ts"],
    },
});
