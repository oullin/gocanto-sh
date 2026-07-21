import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig(
    {
        base: "/",
        cacheDir: "../../storage/.cache/vite/app",
        plugins: [vue(), tailwindcss()],
    },
);
