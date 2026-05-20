<script setup lang="ts">
import { computed, ref } from "vue";
import { stripHtml } from "@gocanto/domain";
import { cn } from "@lib/utils";
import TestimonialCard from "./TestimonialCard.vue";
import type { Testimonial } from "./types";

export type { Testimonial };

const props = withDefaults(
    defineProps<{
        items: readonly Testimonial[];
        speed?: number;
        loading?: boolean;
    }>(),
    { speed: 40, loading: false },
);

const emit = defineEmits<{
    (e: "select", item: Testimonial): void;
}>();

const itemsToDisplay = computed<Testimonial[]>(() => {
    const sanitized = props.items.map((item) => ({
        ...item,
        text: stripHtml(item.text),
    }));
    let result = [...sanitized];

    while (result.length > 0 && result.length < 10) {
        result = [...result, ...sanitized];
    }

    return result;
});

const durationStyle = computed(() => ({ "--duration": `${props.speed}s` }));
const isTouchPaused = ref(false);

const cardBase =
    "tm-card group/card relative flex h-[260px] w-[clamp(260px,82vw,350px)] shrink-0 flex-col justify-between overflow-hidden rounded-md border p-[16px] text-left transition-[border-color] duration-150 transform-gpu [backface-visibility:hidden]";
const cardSurface = "border-[var(--border-strong)] bg-background";
const cardSurfaceFeatured = "tm-card--featured border-[var(--border-strong)] bg-background";
const cardInteractiveHover = "hover:border-[var(--btn-ghost-ring-hover)]";
const cardFocus =
    "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--btn-ghost-ring-hover)]";

function cardClass(item: Testimonial, opts: { interactive: boolean }) {
    return cn(
        cardBase,
        item.featured ? cardSurfaceFeatured : cardSurface,
        opts.interactive && (props.loading ? "cursor-default" : cardInteractiveHover),
        opts.interactive && cardFocus,
    );
}

const trackClass = () =>
    cn(
        "tm-track flex shrink-0 justify-start [gap:var(--gap)] min-w-full pr-[var(--gap)] will-change-transform [backface-visibility:hidden]",
        isTouchPaused.value && "tm-track--paused",
    );

function onSelect(item: Testimonial) {
    emit("select", item);
}

function pauseForTouch() {
    isTouchPaused.value = true;
}

function resumeFromTouch() {
    isTouchPaused.value = false;
}
</script>

<template>
    <div class="tm-root flex flex-col gap-4 py-8 overflow-hidden" :aria-busy="loading || undefined">
        <div
            class="tm-row group flex overflow-hidden p-2 [--gap:1rem] [--tm-mask:48px] [mask-image:linear-gradient(to_right,transparent,#000_var(--tm-mask),#000_calc(100%-var(--tm-mask)),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_var(--tm-mask),#000_calc(100%-var(--tm-mask)),transparent)]"
            @pointerdown="pauseForTouch"
            @pointerup="resumeFromTouch"
            @pointercancel="resumeFromTouch"
            @touchstart.passive="pauseForTouch"
            @touchend.passive="resumeFromTouch"
            @touchcancel.passive="resumeFromTouch"
        >
            <div :class="trackClass()" :style="durationStyle">
                <TestimonialCard
                    v-for="(item, i) in itemsToDisplay"
                    :key="`r1-${i}`"
                    :item="item"
                    :interactive="true"
                    :loading="loading"
                    :card-class="cardClass(item, { interactive: true })"
                    @select="onSelect"
                />
            </div>
            <div aria-hidden="true" :class="trackClass()" :style="durationStyle">
                <TestimonialCard
                    v-for="(item, i) in itemsToDisplay"
                    :key="`r1d-${i}`"
                    :item="item"
                    :interactive="true"
                    :focusable="false"
                    :loading="loading"
                    :card-class="cardClass(item, { interactive: true })"
                    @select="onSelect"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes tm-marquee-left {
    from {
        transform: translate3d(0, 0, 0);
    }
    to {
        transform: translate3d(-100%, 0, 0);
    }
}
.tm-track {
    animation: tm-marquee-left var(--duration) linear infinite;
}
.tm-row:hover .tm-track,
.tm-row:focus-within .tm-track,
.tm-track.tm-track--paused {
    animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
    .tm-track {
        animation: none;
    }
}

@media (max-width: 480px) {
    .tm-row {
        --tm-mask: 20px;
    }
}

.tm-avatar-skeleton {
    background: hsl(0 0% 100% / 0.08);
    animation: sk-pulse 2s ease-in-out infinite;
}
:root[data-theme="light"] .tm-avatar-skeleton {
    background: hsl(0 0% 0% / 0.08);
}
</style>
