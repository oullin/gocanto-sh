import { defineConfig } from "vitest/config";

export default defineConfig(
	{
	    cacheDir: "../../storage/.cache/vitest/store",
	    test: {
	        attachmentsDir: "../../storage/.cache/vitest/attachments",
	        environment: "node",
	        globals: false,
	        include: ["src/**/*.test.ts"],
	        isolate: false,
	        fileParallelism: false,
	        pool: "threads",
	    },
	},
);
