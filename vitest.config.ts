import { defineConfig } from "vitest/config";

export default defineConfig(
    {
        test: {
            projects: [
                "workspace/app",
                "workspace/domain",
                "workspace/llms",
                "workspace/store",
                "workspace/writing",
            ],
        },
    },
);
