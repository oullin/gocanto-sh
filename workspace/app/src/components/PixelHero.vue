<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
import { usePreferredReducedMotion } from "@vueuse/core";

const PixelCanvas = defineAsyncComponent(() => import("./PixelCanvas.vue"));

const mounted = ref(false);
const reducedMotion = usePreferredReducedMotion();
const showCanvas = computed(() => mounted.value && reducedMotion.value !== "reduce");

onMounted(() => {
    mounted.value = true;
});
</script>

<template>
    <section class="pixel-hero">
        <PixelCanvas v-if="showCanvas" />
        <div class="pixel-hero-inner">
            <slot />
        </div>
    </section>
</template>
