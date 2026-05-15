<script setup lang="ts">
import { Send } from "lucide-vue-next";
import { onMounted, onUnmounted, ref } from "vue";
import { Matrix } from "@/components/ui/matrix";

const COLS = 8;
const levels = ref<number[]>(Array(COLS).fill(0.3));
let rafId: number | undefined;
let lastUpdate = 0;
const UPDATE_INTERVAL_MS = 90;

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
    }
}

function tick(now: number) {
    if (now - lastUpdate >= UPDATE_INTERVAL_MS) {
        levels.value = levels.value.map((prev) => {
            const target = Math.random();
            return prev + (target - prev) * 0.55;
        });
        lastUpdate = now;
    }
    rafId = requestAnimationFrame(tick);
}

onMounted(() => {
    rafId = requestAnimationFrame(tick);
});
onUnmounted(() => {
    if (rafId) {cancelAnimationFrame(rafId);}
});
</script>

<template>
    <header class="nav">
        <div class="nav-inner">
            <a href="#" class="nav-brand" aria-label="gocanto home">
                <Matrix
                    :rows="7"
                    :cols="COLS"
                    :levels="levels"
                    :size="3"
                    :gap="1"
                    aria-label="gocanto home"
                    class="nav-logo"
                />
            </a>
            <nav class="nav-links">
                <a href="#work">Work</a>
                <a href="#recommendations">Recommendations</a>
                <a href="#book-a-review">Book a review</a>
            </nav>
            <div class="nav-right">
                <a href="#book-a-review" class="nav-cta">
                    <Send class="nav-cta-icon" :size="14" aria-hidden="true" />
                    <span>Get in touch</span>
                </a>
                <button type="button" class="nav-avatar" aria-label="Back to top" @click="scrollToTop">
                    <img src="/avatar.jpg" alt="" width="32" height="32" />
                </button>
            </div>
        </div>
    </header>
</template>
