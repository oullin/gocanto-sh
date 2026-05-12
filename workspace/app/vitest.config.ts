import { defineConfig } from "vitest/config";

import viteConfig from "#config/vite";

export default defineConfig({
    ...viteConfig,
    cacheDir: "../../storage/.cache/vitest/app",
    test: {
        attachmentsDir: "../../storage/.cache/vitest/attachments",
        environment: "node",
        include: ["src/**/*.test.ts"],
    },
});
