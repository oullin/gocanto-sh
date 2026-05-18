<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

type Resolved = "light" | "dark";
type ThemeMode = "system" | Resolved;

const STORAGE_KEY = "theme";

const mode = ref<ThemeMode>("system");
const systemPrefersDark = ref(false);
let mediaQuery: MediaQueryList | null = null;

const resolved = computed<Resolved>(() => {
    if (mode.value === "system") {
        return systemPrefersDark.value ? "dark" : "light";
    }

    return mode.value;
});

function applyTheme(value: Resolved) {
    document.documentElement.dataset.theme = value;
}

function setMode(next: Exclude<ThemeMode, "system">) {
    mode.value = next;
    localStorage.setItem(STORAGE_KEY, next);
}

function toggle() {
    setMode(resolved.value === "dark" ? "light" : "dark");
}

function handleSystemChange(event: MediaQueryListEvent) {
    systemPrefersDark.value = event.matches;
}

onMounted(() => {
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    systemPrefersDark.value = mediaQuery.matches;
    mediaQuery.addEventListener("change", handleSystemChange);

    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === "light" || stored === "dark") {
        mode.value = stored;
    }

    applyTheme(resolved.value);
});

onBeforeUnmount(() => {
    if (mediaQuery) {
        mediaQuery.removeEventListener("change", handleSystemChange);
    }
});

watch(resolved, applyTheme);
</script>

<template>
    <button
        type="button"
        class="theme-switch"
        :data-resolved="resolved"
        :aria-label="`Switch to ${resolved === 'dark' ? 'light' : 'dark'} mode`"
        :aria-pressed="resolved === 'dark'"
        @click="toggle"
    >
        <svg
            class="theme-switch__icon theme-switch__icon--sun"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
            <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
            <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
        </svg>
        <span class="theme-switch__thumb"></span>
        <svg
            class="theme-switch__icon theme-switch__icon--moon"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    </button>
</template>
