<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useElementSize, useIntersectionObserver } from "@vueuse/core";

// --- Visual config ---------------------------------------------------------
const PIXEL = 4; // px size of each square (logical px, pre-DPR)
const GAP = 4; // px space between squares
const STEP = PIXEL + GAP;

// Speed knob on the same 0-100 scale used by the unlumen reference.
const SPEED = 35;
const speedN = SPEED / 100;
// Activations-per-second and decay-per-second both scale with speed so the
// equilibrium density stays roughly constant; speed just controls turnover.
const ACTIVATIONS_PER_SEC = 80 + 720 * speedN;
const DECAY_PER_SEC = 0.3 + 1.4 * speedN;
const MAX_ALPHA = 0.42;

const host = ref<HTMLDivElement | null>(null);
const { width, height } = useElementSize(host);

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let rafId = 0;
let visible = true;
let lastFrameMs = 0;
let activationCarry = 0;

let pixelStates: Float32Array | null = null;
let cols = 0;
let rows = 0;

let pixelColor = "rgba(160, 160, 170, 1)";

function readPixelColor(): string {
    const root = document.documentElement;
    const raw = getComputedStyle(root).getPropertyValue("--ink-soft").trim();
    return raw || "rgba(160, 160, 170, 1)";
}

function rebuildGrid(wCss: number, hCss: number) {
    cols = Math.ceil(wCss / STEP) + 1;
    rows = Math.ceil(hCss / STEP) + 1;
    pixelStates = new Float32Array(cols * rows);
}

function setDpr() {
    if (!canvas) {return;}
    const w = host.value?.clientWidth ?? 0;
    const h = host.value?.clientHeight ?? 0;
    if (w === 0 || h === 0) {return;}
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuildGrid(w, h);
}

function frame(nowMs: number) {
    if (!canvas || !ctx || !host.value || !pixelStates) {
        rafId = requestAnimationFrame(frame);
        return;
    }

    const w = host.value.clientWidth;
    const h = host.value.clientHeight;
    if (w === 0 || h === 0) {
        rafId = requestAnimationFrame(frame);
        return;
    }

    // dt is clamped: a hidden tab returns huge gaps that would otherwise
    // light up half the grid on the next visible frame.
    const dt = lastFrameMs === 0 ? 1 / 60 : Math.min(0.1, (nowMs - lastFrameMs) / 1000);
    lastFrameMs = nowMs;

    if (!visible) {
        rafId = requestAnimationFrame(frame);
        return;
    }

    // Fractional activation count carried over between frames so the average
    // rate stays accurate at any fps.
    const target = ACTIVATIONS_PER_SEC * dt + activationCarry;
    const n = Math.floor(target);
    activationCarry = target - n;
    for (let i = 0; i < n; i++) {
        const idx = (Math.random() * pixelStates.length) | 0;
        pixelStates[idx] = 1.0;
    }

    const decayMul = Math.max(0, 1 - DECAY_PER_SEC * dt);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = pixelColor;

    let i = 0;
    for (let row = 0; row < rows; row++) {
        const py = row * STEP;
        for (let col = 0; col < cols; col++) {
            const b = pixelStates[i] * decayMul;
            pixelStates[i] = b;
            if (b > 0.02) {
                ctx.globalAlpha = b * MAX_ALPHA;
                ctx.fillRect(col * STEP, py, PIXEL, PIXEL);
            }
            i++;
        }
    }
    ctx.globalAlpha = 1;

    rafId = requestAnimationFrame(frame);
}

onMounted(() => {
    const el = host.value;
    if (!el) {return;}
    canvas = document.createElement("canvas");
    canvas.style.display = "block";
    el.appendChild(canvas);
    ctx = canvas.getContext("2d");
    if (!ctx) {return;}

    pixelColor = readPixelColor();
    setDpr();
    lastFrameMs = 0;
    rafId = requestAnimationFrame(frame);
});

watch([width, height], () => setDpr());

useIntersectionObserver(host, ([entry]) => {
    visible = entry?.isIntersecting ?? true;
    if (visible) {lastFrameMs = 0;} // avoid a stale-dt burst on re-entry
});

let themeObserver: MutationObserver | null = null;
onMounted(() => {
    themeObserver = new MutationObserver(() => {
        pixelColor = readPixelColor();
    });
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class"],
    });
});

onBeforeUnmount(() => {
    cancelAnimationFrame(rafId);
    themeObserver?.disconnect();
    themeObserver = null;
    if (canvas?.parentElement === host.value && host.value) {
        host.value.removeChild(canvas);
    }
    canvas = null;
    ctx = null;
    pixelStates = null;
});
</script>

<template>
    <div ref="host" class="pixel-hero-canvas" aria-hidden="true"></div>
</template>
