<script setup lang="ts">
import { Send } from "lucide-vue-next";
import { onMounted, onUnmounted, ref } from "vue";
import { Matrix } from "@/components/ui/matrix";

const COLS = 8;
const levels = ref<number[]>(Array(COLS).fill(0.3));
let rafId: number | undefined;
let lastUpdate = 0;
const UPDATE_INTERVAL_MS = 90;

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
                <a href="#writing">Writing</a>
                <a href="#work">Work</a>
                <a href="#about">About</a>
                <a href="#recommendations">Recommendations</a>
                <a href="#contact">Contact</a>
            </nav>
            <div class="nav-right">
                <a href="#contact" class="nav-cta">
                    <Send class="nav-cta-icon" :size="14" aria-hidden="true" />
                    <span>Get in touch</span>
                </a>
                <a href="#about" class="nav-avatar" aria-label="Profile">
                    <img src="/avatar.jpg" alt="" width="32" height="32" />
                </a>
            </div>
        </div>
    </header>
</template>
