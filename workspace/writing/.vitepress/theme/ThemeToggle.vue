<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ThemeMode } from "#writing/theme/theme-mode";
import type { ThemeChoice } from "#writing/theme/theme-mode";

const mode = ref<ThemeChoice>("system");

let themeMode: ThemeMode | null = null;

function setMode(next: ThemeChoice): void {
    if (!themeMode) {
        return;
    }

    mode.value = next;
    themeMode.persist(next);
}

onMounted(() => {
    // Drive appearance through storage, not VitePress's boolean isDark ref: its
    // VueUse `useDark` store listens for storage events, so writing the exact
    // "auto"/"light"/"dark" value and emitting one lets it apply the class and
    // follow the OS for "auto" — whereas the boolean setter collapses an
    // explicit choice matching the OS back to "auto" and loses it. VitePress's
    // boot script already applied the stored theme before paint, so mounting
    // only needs to reflect the stored choice in the control.
    themeMode = new ThemeMode(window.localStorage, (key, value) => {
        window.dispatchEvent(
            new StorageEvent("storage", {
                key,
                newValue: value,
                storageArea: window.localStorage,
            }),
        );
    });

    mode.value = themeMode.stored();
});
</script>

<template>
    <fieldset class="theme-toggle" aria-label="Select a display theme">
        <legend class="sr-only">Select a display theme</legend>
        <label
            v-for="option in ['system', 'light', 'dark'] as const"
            :key="option"
            class="theme-toggle__option"
            :class="{ 'is-active': mode === option }"
        >
            <input
                type="radio"
                name="theme"
                :value="option"
                :checked="mode === option"
                @change="setMode(option)"
            />
            <span class="sr-only">{{ option }}</span>
            <svg
                v-if="option === 'system'"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <svg
                v-else-if="option === 'light'"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
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
            <svg
                v-else
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
        </label>
    </fieldset>
</template>
