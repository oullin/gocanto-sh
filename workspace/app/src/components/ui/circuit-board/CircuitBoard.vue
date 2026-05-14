<script setup lang="ts">
import { computed, type Component } from "vue";

export type CircuitNode = {
    id: string;
    x: number;
    y: number;
    label?: string;
    size?: number;
    icon: Component;
};

export type CircuitConnection = {
    from: string;
    to: string;
    animated?: boolean;
    bidirectional?: boolean;
};

const props = withDefaults(
    defineProps<{
        nodes: readonly CircuitNode[];
        connections: readonly CircuitConnection[];
        width?: number;
        height?: number;
        showGrid?: boolean;
        pulseSpeed?: number;
        traceWidth?: number;
        patternId?: string;
    }>(),
    {
        width: 600,
        height: 400,
        showGrid: true,
        pulseSpeed: 3.5,
        traceWidth: 1.5,
        patternId: "circuit-grid",
    },
);

const nodeMap = computed(() => {
    const map = new Map<string, CircuitNode>();
    for (const n of props.nodes) {map.set(n.id, n);}
    return map;
});

const lines = computed(() =>
    props.connections
        .map((c, idx) => {
            const a = nodeMap.value.get(c.from);
            const b = nodeMap.value.get(c.to);
            if (!a || !b) {return null;}
            return {
                key: `${c.from}-${c.to}-${idx}`,
                x1: a.x,
                y1: a.y,
                x2: b.x,
                y2: b.y,
                animated: c.animated ?? false,
                bidirectional: c.bidirectional ?? false,
            };
        })
        .filter((v): v is NonNullable<typeof v> => v !== null),
);

const viewBox = computed(() => `0 0 ${props.width} ${props.height}`);
const animationDuration = computed(() => `${props.pulseSpeed}s`);
</script>

<template>
    <svg
        class="circuit-board"
        :viewBox="viewBox"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
    >
        <defs>
            <pattern
                :id="patternId"
                x="0"
                y="0"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
            >
                <circle cx="0.75" cy="0.75" r="0.75" fill="currentColor" />
            </pattern>
        </defs>

        <rect
            v-if="showGrid"
            x="0"
            y="0"
            :width="width"
            :height="height"
            :fill="`url(#${patternId})`"
            class="circuit-board__grid"
        />

        <g class="circuit-board__traces">
            <line
                v-for="l in lines"
                :key="l.key"
                :x1="l.x1"
                :y1="l.y1"
                :x2="l.x2"
                :y2="l.y2"
                stroke="currentColor"
                :stroke-width="traceWidth"
                stroke-linecap="round"
                :class="[
                    'circuit-board__trace',
                    l.animated && 'circuit-board__trace--animated',
                    l.bidirectional && 'circuit-board__trace--bidir',
                ]"
                :style="{ animationDuration: animationDuration }"
            />
        </g>

        <g class="circuit-board__nodes">
            <g v-for="n in nodes" :key="n.id" :transform="`translate(${n.x}, ${n.y})`">
                <circle
                    :r="(n.size ?? 12) + 4"
                    class="circuit-board__node-halo"
                    fill="currentColor"
                />
                <circle
                    :r="n.size ?? 12"
                    class="circuit-board__node-body"
                />
                <foreignObject
                    :x="-(n.size ?? 12)"
                    :y="-(n.size ?? 12)"
                    :width="(n.size ?? 12) * 2"
                    :height="(n.size ?? 12) * 2"
                >
                    <div class="circuit-board__node-icon">
                        <component :is="n.icon" :size="(n.size ?? 12) * 1.1" :stroke-width="1.25" />
                    </div>
                </foreignObject>
            </g>
        </g>
    </svg>
</template>
