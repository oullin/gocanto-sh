import { defineConfig } from "vitest/config";

export default defineConfig(
	{
	    test: {
	        projects: [
	            "workspace/app",
	            "workspace/store",
	            "workspace/domain",
	            "workspace/llms",
	            "workspace/writing",
	        ],
	    },
	},
);
