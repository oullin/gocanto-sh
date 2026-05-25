<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";
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

onMounted(() => {
    window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
    <GlobalSearch v-if="shouldLoad" />
</template>
