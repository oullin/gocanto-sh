<script setup lang="ts">
import { computed } from "vue";
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

const sanitizeText = (html: string): string =>
    html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");

const itemsToDisplay = computed<Testimonial[]>(() => {
    const sanitized = props.items.map((item) => ({
        ...item,
        text: sanitizeText(item.text),
    }));
    let result = [...sanitized];
    while (result.length > 0 && result.length < 10) {
        result = [...result, ...sanitized];
    }
    return result;
});

const half = computed(() => Math.ceil(itemsToDisplay.value.length / 2));

const rows = computed(() => [
    { direction: "tm-left" as const, items: itemsToDisplay.value.slice(0, half.value), keyPrefix: "r1" },
    { direction: "tm-right" as const, items: itemsToDisplay.value.slice(half.value), keyPrefix: "r2" },
]);

const durationStyle = computed(() => ({ "--duration": `${props.speed}s` }));

const cardBase =
    "tm-card group/card relative flex h-[260px] w-[350px] shrink-0 flex-col justify-between overflow-hidden rounded-md border p-[16px] text-left transition-[border-color] duration-150 transform-gpu [backface-visibility:hidden]";
const cardSurface = "border-[var(--border-strong)] bg-background";
const cardSurfaceFeatured = "tm-card--featured border-[var(--border-strong)] bg-background";
const cardInteractiveHover = "hover:border-[var(--btn-ghost-ring-hover)]";
const cardFocus = "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--btn-ghost-ring-hover)]";

function cardClass(item: Testimonial, opts: { interactive: boolean }) {
    return cn(
        cardBase,
        item.featured ? cardSurfaceFeatured : cardSurface,
        opts.interactive && (props.loading ? "cursor-default" : cardInteractiveHover),
        opts.interactive && cardFocus,
    );
}

const trackClass = (direction: "tm-left" | "tm-right") =>
    cn(
        "tm-track flex shrink-0 justify-start [gap:var(--gap)] min-w-full pr-[var(--gap)] will-change-transform [backface-visibility:hidden]",
        direction,
    );

function onSelect(item: Testimonial) {
    emit("select", item);
}
</script>

<template>
    <div class="tm-root flex flex-col gap-4 py-8 overflow-hidden" :aria-busy="loading || undefined">
        <div
            v-for="row in rows"
            :key="row.keyPrefix"
            class="tm-row group flex overflow-hidden p-2 [--gap:1rem] [mask-image:linear-gradient(to_right,transparent,#000_48px,#000_calc(100%-48px),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_48px,#000_calc(100%-48px),transparent)]"
        >
            <div :class="trackClass(row.direction)" :style="durationStyle">
                <TestimonialCard
                    v-for="(item, i) in row.items"
                    :key="`${row.keyPrefix}-${i}`"
                    :item="item"
                    :interactive="true"
                    :loading="loading"
                    :card-class="cardClass(item, { interactive: true })"
                    @select="onSelect"
                />
            </div>
            <div aria-hidden="true" :class="trackClass(row.direction)" :style="durationStyle">
                <TestimonialCard
                    v-for="(item, i) in row.items"
                    :key="`${row.keyPrefix}d-${i}`"
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
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(-100%, 0, 0); }
}
@keyframes tm-marquee-right {
    from { transform: translate3d(-100%, 0, 0); }
    to { transform: translate3d(0, 0, 0); }
}
.tm-track.tm-left {
    animation: tm-marquee-left var(--duration) linear infinite;
}
.tm-track.tm-right {
    animation: tm-marquee-right var(--duration) linear infinite;
}
.tm-row:hover .tm-track,
.tm-row:focus-within .tm-track {
    animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
    .tm-track.tm-left,
    .tm-track.tm-right {
        animation: none;
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
