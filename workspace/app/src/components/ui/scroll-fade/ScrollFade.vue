<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();

const root = ref<HTMLDivElement | null>(null);
const viewport = ref<HTMLDivElement | null>(null);
const thumb = ref<HTMLDivElement | null>(null);

const FADE_PX = 64;
const MIN_THUMB = 32;

let resizeObserver: ResizeObserver | null = null;
let scrollHandler: (() => void) | null = null;
let usingJsFade = false;

function update() {
    const v = viewport.value;
    const t = thumb.value;

    if (!v || !t) {
        return;
    }

    const max = v.scrollHeight - v.clientHeight;

    if (usingJsFade) {
        if (max > 0) {
            v.style.setProperty("--ft", Math.min(1, v.scrollTop / FADE_PX).toFixed(3));
            v.style.setProperty("--fb", Math.min(1, (max - v.scrollTop) / FADE_PX).toFixed(3));
        } else {
            v.style.setProperty("--ft", "0");
            v.style.setProperty("--fb", "0");
        }
    }

    if (max <= 0) {
        t.style.opacity = "0";

        return;
    }

    const track = v.clientHeight;
    const thumbH = Math.max(MIN_THUMB, (v.clientHeight / v.scrollHeight) * track);
    const top = (v.scrollTop / max) * (track - thumbH);

    t.style.opacity = "";
    t.style.height = `${thumbH}px`;
    t.style.transform = `translateY(${top}px)`;
}

onMounted(() => {
    const v = viewport.value;

    if (!v) {
        return;
    }

    const supportsScrollTimeline =
        typeof CSS !== "undefined" &&
        typeof CSS.supports === "function" &&
        CSS.supports("animation-timeline", "scroll()");

    if (!supportsScrollTimeline) {
        usingJsFade = true;
        v.setAttribute("data-fade-js", "");
    }

    scrollHandler = update;
    v.addEventListener("scroll", scrollHandler, { passive: true });
    resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(v);
    update();
});

onBeforeUnmount(() => {
    const v = viewport.value;

    if (v && scrollHandler) {
        v.removeEventListener("scroll", scrollHandler);
    }

    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }

    scrollHandler = null;
});

defineExpose({ root, viewport });
</script>

<template>
    <div ref="root" :class="cn('scroll-fade-root', props.class)">
        <div ref="viewport" class="scroll-fade-y" data-slot="scroll-area-viewport">
            <slot />
        </div>
        <div class="scroll-fade-scrollbar" aria-hidden="true">
            <div ref="thumb" class="scroll-fade-thumb"></div>
        </div>
    </div>
</template>
