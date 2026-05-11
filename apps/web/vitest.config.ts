import { defineConfig } from "vitest/config"

import viteConfig from "#config/vite"

export default defineConfig({
  ...viteConfig,
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
})
