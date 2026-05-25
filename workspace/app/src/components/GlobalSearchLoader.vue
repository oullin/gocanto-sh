<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { defineAsyncComponent, ref, watch } from "vue";
import { globalSearchOpen } from "@lib/globalSearch";

const GlobalSearch = defineAsyncComponent(() => import("@components/GlobalSearch.vue"));
const shouldLoad = ref(globalSearchOpen.value);

watch(globalSearchOpen, (open) => {
    if (open) {
        shouldLoad.value = true;
    }
});

const onKeydown = (event: KeyboardEvent) => {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") {
        return;
    }

    event.preventDefault();
    shouldLoad.value = true;
    globalSearchOpen.value = !globalSearchOpen.value;
};

useEventListener(() => (typeof window === "undefined" ? null : window), "keydown", onKeydown);
</script>

<template>
    <GlobalSearch v-if="shouldLoad" />
</template>
