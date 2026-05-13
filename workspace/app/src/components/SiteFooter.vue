<script setup lang="ts">
import { Moon, Sun } from "lucide-vue-next";

import { useTheme } from "@/composables/useTheme";

const { theme, toggle } = useTheme();
</script>

<template>
    <footer class="foot">
        <span>© 2026 GOCANTO</span>
        <span>HI@GOCANTO.DEV</span>
        <span>+65 8292 9267</span>
        <span>LINKEDIN.COM/IN/GOCANTO</span>
        <button
            type="button"
            class="theme-toggle"
            :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
            @click="toggle"
        >
            <Sun v-if="theme === 'dark'" :size="14" :stroke-width="2" />
            <Moon v-else :size="14" :stroke-width="2" />
        </button>
    </footer>
</template>
