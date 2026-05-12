<script setup lang="ts">
withDefaults(defineProps<{ top?: boolean }>(), { top: false });
</script>

<template>
    <span
        class="cross-mark absolute bottom-0 right-[calc(50%-min(100%,var(--container-page))/2)] z-[5] translate-x-1/2 translate-y-1/2 text-fg-3 max-mid:hidden"
        aria-hidden="true"
    ></span>
    <span
        class="cross-mark absolute bottom-0 left-[calc(50%-min(100%,var(--container-page))/2)] z-[5] -translate-x-1/2 translate-y-1/2 text-fg-3 max-mid:hidden"
        aria-hidden="true"
    ></span>
    <template v-if="top">
        <span
            class="cross-mark absolute top-0 right-[calc(50%-min(100%,var(--container-page))/2)] z-[5] -translate-y-1/2 translate-x-1/2 text-fg-3 max-mid:hidden"
            aria-hidden="true"
        ></span>
        <span
            class="cross-mark absolute top-0 left-[calc(50%-min(100%,var(--container-page))/2)] z-[5] -translate-x-1/2 -translate-y-1/2 text-fg-3 max-mid:hidden"
            aria-hidden="true"
        ></span>
    </template>
</template>
