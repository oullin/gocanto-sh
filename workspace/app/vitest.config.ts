import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig(
	{
	    cacheDir: "../../storage/.cache/vitest/app",
	    plugins: [vue()],
	    test: {
	        attachmentsDir: "../../storage/.cache/vitest/attachments",
	        environment: "happy-dom",
	        globals: false,
	        include: ["src/**/*.test.ts"],
	        pool: "threads",
	        sequence: {
	            groupOrder: 0,
	        },
	        singleThread: true,
	    },
	},
);
