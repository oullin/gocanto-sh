<script setup lang="ts">
import { ArrowUp } from "lucide-vue-next";
import { onBeforeUnmount, onMounted, ref } from "vue";

const isVisible = ref(false);

const updateVisibility = () => {
    isVisible.value = window.scrollY > 320;
};

const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
    });
};

onMounted(() => {
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", updateVisibility);
});
</script>

<template>
    <button
        type="button"
        class="back-to-top"
        :class="{ 'is-visible': isVisible }"
        aria-label="Back to top"
        @click="scrollToTop"
    >
        <ArrowUp class="back-to-top__icon" aria-hidden="true" />
    </button>
</template>
