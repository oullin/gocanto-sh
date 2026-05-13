import { ref, watch } from "vue";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function resolveInitial(): Theme {
    if (typeof window === "undefined") {return "dark";}
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {return stored;}
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const theme = ref<Theme>(resolveInitial());

watch(
    theme,
    (next) => {
        if (typeof document === "undefined") {return;}
        document.documentElement.dataset.theme = next;
        window.localStorage.setItem(STORAGE_KEY, next);
        const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
        if (meta) {meta.content = next === "dark" ? "#0a0a0a" : "#fafaf7";}
    },
    { immediate: true },
);

export function useTheme() {
    function toggle() {
        theme.value = theme.value === "dark" ? "light" : "dark";
    }
    return { theme, toggle };
}
