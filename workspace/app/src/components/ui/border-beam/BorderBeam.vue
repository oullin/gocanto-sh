<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        size?: number;
        duration?: number;
        borderWidth?: number;
        colorFrom?: string;
        colorTo?: string;
        delay?: number;
        reverse?: boolean;
    }>(),
    {
        size: 200,
        duration: 25,
        borderWidth: 1.5,
        colorFrom: "hsl(217 91% 60%)",
        colorTo: "hsl(270 91% 65%)",
        delay: 0,
        reverse: false,
    },
);

const wrapperStyle = computed(() => ({
    "--bb-border-width": `${props.borderWidth}px`,
}));

const beadStyle = computed(() => ({
    "--bb-size": `${props.size}px`,
    "--bb-duration": `${props.duration}s`,
    "--bb-delay": `${-props.delay}s`,
    "--bb-color-from": props.colorFrom,
    "--bb-color-to": props.colorTo,
    animationDirection: props.reverse ? "reverse" : "normal",
}));
</script>

<template>
    <div class="border-beam" :style="wrapperStyle" aria-hidden="true">
        <div class="border-beam__bead" :style="beadStyle" />
    </div>
</template>

<style scoped>
.border-beam {
    pointer-events: none;
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border-width: var(--bb-border-width);
    border-style: solid;
    border-color: transparent;
    -webkit-mask:
        linear-gradient(transparent, transparent),
        linear-gradient(#fff, #fff);
    -webkit-mask-clip: padding-box, border-box;
    -webkit-mask-composite: source-in;
    mask:
        linear-gradient(transparent, transparent),
        linear-gradient(#fff, #fff);
    mask-clip: padding-box, border-box;
    mask-composite: intersect;
}

.border-beam__bead {
    position: absolute;
    width: var(--bb-size);
    aspect-ratio: 1;
    background: linear-gradient(
        to left,
        var(--bb-color-from),
        var(--bb-color-to),
        transparent
    );
    offset-path: rect(0 auto auto 0 round var(--bb-size));
    animation: border-beam-travel var(--bb-duration) linear infinite;
    animation-delay: var(--bb-delay);
}

@keyframes border-beam-travel {
    from {
        offset-distance: 0%;
    }
    to {
        offset-distance: 100%;
    }
}

@media (prefers-reduced-motion: reduce) {
    .border-beam__bead {
        animation-play-state: paused;
    }
}
</style>
