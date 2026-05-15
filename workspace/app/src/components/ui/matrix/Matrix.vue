<script setup lang="ts">
import { computed, useId } from "vue";
import { ensureFrameSize, vu, type Frame } from "./index";

interface Palette {
    on: string;
    off: string;
}

const props = withDefaults(
    defineProps<{
        rows: number;
        cols: number;
        levels: number[];
        size?: number;
        gap?: number;
        brightness?: number;
        palette?: Palette;
        ariaLabel?: string;
    }>(),
    {
        size: 10,
        gap: 2,
        brightness: 1,
        palette: () => ({ on: "currentColor", off: "var(--muted-foreground)" }),
        ariaLabel: "matrix display",
    },
);

const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
const onGradId = `matrix-pixel-on-${uid}`;
const offGradId = `matrix-pixel-off-${uid}`;
const glowId = `matrix-glow-${uid}`;

const currentFrame = computed<Frame>(() =>
    ensureFrameSize(vu(props.cols, props.levels), props.rows, props.cols),
);

const svgDimensions = computed(() => ({
    width: props.cols * (props.size + props.gap) - props.gap,
    height: props.rows * (props.size + props.gap) - props.gap,
}));

const radius = computed(() => (props.size / 2) * 0.9);

interface Cell {
    key: string;
    cx: number;
    cy: number;
    opacity: number;
    isOn: boolean;
    isActive: boolean;
    fill: string;
    transform: string;
}

const cells = computed<Cell[]>(() => {
    const out: Cell[] = [];
    const frame = currentFrame.value;
    for (let row = 0; row < props.rows; row++) {
        for (let col = 0; col < props.cols; col++) {
            const value = frame[row]?.[col] ?? 0;
            const opacity = Math.max(0, Math.min(1, props.brightness * value));
            const isActive = opacity > 0.5;
            const isOn = opacity > 0.05;
            out.push({
                key: `${row}-${col}`,
                cx: col * (props.size + props.gap) + props.size / 2,
                cy: row * (props.size + props.gap) + props.size / 2,
                opacity: isOn ? opacity : 0.1,
                isOn,
                isActive,
                fill: isOn ? `url(#${onGradId})` : `url(#${offGradId})`,
                transform: `scale(${isActive ? 1.1 : 1})`,
            });
        }
    }
    return out;
});

const styleVars = computed(() => ({
    "--matrix-on": props.palette.on,
    "--matrix-off": props.palette.off,
    "--matrix-gap": `${props.gap}px`,
    "--matrix-size": `${props.size}px`,
}));
</script>

<template>
    <div
        role="img"
        :aria-label="ariaLabel"
        class="relative inline-block"
        :style="styleVars"
    >
        <svg
            :width="svgDimensions.width"
            :height="svgDimensions.height"
            :viewBox="`0 0 ${svgDimensions.width} ${svgDimensions.height}`"
            xmlns="http://www.w3.org/2000/svg"
            class="block"
            style="overflow: visible"
        >
            <defs>
                <radialGradient :id="onGradId" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="var(--matrix-on)" stop-opacity="1" />
                    <stop offset="70%" stop-color="var(--matrix-on)" stop-opacity="0.85" />
                    <stop offset="100%" stop-color="var(--matrix-on)" stop-opacity="0.6" />
                </radialGradient>
                <radialGradient :id="offGradId" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="var(--matrix-off)" stop-opacity="1" />
                    <stop offset="100%" stop-color="var(--matrix-off)" stop-opacity="0.7" />
                </radialGradient>
                <filter :id="glowId" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            <circle
                v-for="cell in cells"
                :key="cell.key"
                class="matrix-pixel"
                :class="{
                    'matrix-pixel-active': cell.isActive,
                    'matrix-pixel-off-state': !cell.isOn,
                }"
                :cx="cell.cx"
                :cy="cell.cy"
                :r="radius"
                :fill="cell.fill"
                :opacity="cell.opacity"
                :style="{ transform: cell.transform, filter: cell.isActive ? `url(#${glowId})` : undefined }"
            />
        </svg>
    </div>
</template>

<style scoped>
.matrix-pixel {
    transition:
        opacity 300ms ease-out,
        transform 150ms ease-out;
    transform-origin: center;
    transform-box: fill-box;
}
.matrix-pixel-off-state {
    opacity: 0.2;
}
:root[data-theme="dark"] .matrix-pixel-off-state {
    opacity: 0.1;
}
</style>
