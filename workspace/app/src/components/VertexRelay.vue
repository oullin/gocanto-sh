<script setup lang="ts">
const SIZE = 5

const OUTER_ORDER: Record<string, number> = {
  "0,0": 0, "0,1": 1, "0,2": 2, "0,3": 3, "0,4": 4,
  "1,4": 5, "2,4": 6, "3,4": 7,
  "4,4": 8, "4,3": 9, "4,2": 10, "4,1": 11, "4,0": 12,
  "3,0": 13, "2,0": 14, "1,0": 15,
}

const MIDDLE_ORDER: Record<string, number> = {
  "1,1": 0, "2,1": 1, "3,1": 2, "3,2": 3, "3,3": 4, "2,3": 5, "1,3": 6, "1,2": 7,
}

type Ring = "outer" | "middle" | "center"

function ringFor(row: number, col: number): Ring {
  const key = `${row},${col}`
  if (key in OUTER_ORDER) return "outer"
  if (key in MIDDLE_ORDER) return "middle"
  return "center"
}

function orderFor(row: number, col: number, ring: Ring): number {
  const key = `${row},${col}`
  if (ring === "outer") return OUTER_ORDER[key]!
  if (ring === "middle") return MIDDLE_ORDER[key]!
  return 0
}
</script>

<template>
  <div class="twin-orbit" role="img" aria-label="gocanto">
    <template v-for="row in SIZE" :key="row">
      <span
        v-for="col in SIZE"
        :key="`${row}-${col}`"
        class="twin-orbit__dot"
        :class="[`twin-orbit__dot--${ringFor(row - 1, col - 1)}`]"
        :style="{ '--order': orderFor(row - 1, col - 1, ringFor(row - 1, col - 1)) }"
      />
    </template>
  </div>
</template>

<style scoped>
.twin-orbit {
  --dot-size: 4px;
  --gap: 2px;
  --speed: 0.85;
  --cycle: 1500ms;
  --opacity-base: 0.1;
  --opacity-mid: 0.4;
  --opacity-peak: 0.95;
  --duration: calc(var(--cycle) / var(--speed));

  display: grid;
  grid-template-columns: repeat(5, var(--dot-size));
  grid-auto-rows: var(--dot-size);
  gap: var(--gap);
  color: currentColor;
}

.twin-orbit__dot {
  width: var(--dot-size);
  height: var(--dot-size);
  background: currentColor;
  border-radius: 50%;
  opacity: var(--opacity-base);
}

.twin-orbit__dot--center {
  visibility: hidden;
}

.twin-orbit__dot--outer {
  animation: twin-orbit-ring var(--duration) linear infinite;
  animation-delay: calc(var(--order) * 0.0625 * var(--duration));
  will-change: opacity;
}

.twin-orbit__dot--middle {
  animation: twin-orbit-ring var(--duration) linear infinite;
  animation-delay: calc(var(--order) * 0.125 * var(--duration));
  will-change: opacity;
}

@keyframes twin-orbit-ring {
  0%, 100% {
    opacity: calc(0.5 * var(--opacity-base));
  }
  10% {
    opacity: var(--opacity-peak);
  }
  20% {
    opacity: calc(0.45 * var(--opacity-peak) + 0.45 * var(--opacity-mid) + 0.1 * var(--opacity-base));
  }
  30% {
    opacity: calc(0.2 * var(--opacity-peak) + 0.4 * var(--opacity-mid) + 0.4 * var(--opacity-base));
  }
  40% {
    opacity: calc(0.875 * var(--opacity-base));
  }
}

@media (prefers-reduced-motion: reduce) {
  .twin-orbit__dot--outer,
  .twin-orbit__dot--middle {
    animation: none;
    opacity: calc(var(--opacity-base) + var(--opacity-mid) * 0.4);
  }
}
</style>
