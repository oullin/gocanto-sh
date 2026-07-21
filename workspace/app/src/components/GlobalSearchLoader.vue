<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { defineAsyncComponent, ref, watch } from "vue";
import { useGlobalSearch } from "#app/lib/globalSearch";

const GlobalSearch = defineAsyncComponent(() => import("#app/components/GlobalSearch.vue"));
const { open } = useGlobalSearch();

const shouldLoad = ref(open.value);

watch(open, (isOpen) => {
    if (isOpen) {
        shouldLoad.value = true;
    }
});

const onKeydown = (event: KeyboardEvent) => {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") {
        return;
    }

    event.preventDefault();
    shouldLoad.value = true;
    open.value = !open.value;
};

useEventListener(() => (typeof window === "undefined" ? null : window), "keydown", onKeydown);
</script>

<template>
    <GlobalSearch v-if="shouldLoad" />
</template>
