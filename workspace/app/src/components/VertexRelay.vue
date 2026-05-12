<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"

const ROW_COUNTS = [3, 4, 5, 4, 3] as const
const HEX_ROW_PITCH_RATIO = Math.sqrt(3) / 2
const BASE_OPACITY = 0.1
const MID_OPACITY = 0.4
const HIGH_OPACITY = 0.95
const TRAIL_SPAN = 2.2
const CYCLE_MS = 1650 / 0.9

const VERTEX_PATH = [
  "0,2", "1,3", "2,4", "3,3", "4,2", "3,0", "2,0", "1,0", "0,0",
] as const
type Vertex = (typeof VERTEX_PATH)[number]
const PATH_LEN = VERTEX_PATH.length

const ECHO_BY_VERTEX: Record<Vertex, readonly string[]> = {
  "0,2": ["0,1", "1,2"],
  "1,3": ["1,2", "2,3"],
  "2,4": ["2,3", "2,2"],
  "3,3": ["3,2", "2,3"],
  "4,2": ["4,1", "3,2"],
  "3,0": ["3,1", "2,1"],
  "2,0": ["2,1", "2,2"],
  "1,0": ["1,1", "2,1"],
  "0,0": ["0,1", "1,1"],
}

const cells: { row: number; col: number; id: string; x: number; y: number }[] = []
ROW_COUNTS.forEach((count, row) => {
  for (let col = 0; col < count; col += 1) {
    const x = col - (count - 1) / 2
    const y = (row - 2) * HEX_ROW_PITCH_RATIO
    cells.push({ row, col, id: `${row},${col}`, x, y })
  }
})

const modF = (n: number, m: number) => ((n % m) + m) % m

function opacityForCell(id: string, x: number, y: number, phase: number): number {
  const head = phase * PATH_LEN
  let opacity = BASE_OPACITY

  const vertexIndex = VERTEX_PATH.indexOf(id as Vertex)
  if (vertexIndex >= 0) {
    const dist = modF(head - vertexIndex, PATH_LEN)
    const glow = Math.max(0, 1 - dist / TRAIL_SPAN)
    opacity = Math.max(opacity, BASE_OPACITY + glow * (HIGH_OPACITY - BASE_OPACITY))
  }

  for (let i = 0; i < PATH_LEN; i += 1) {
    const vertex = VERTEX_PATH[i]!
    if (!ECHO_BY_VERTEX[vertex].includes(id)) continue
    const dist = modF(head - i, PATH_LEN)
    const echo = Math.max(0, 1 - Math.abs(dist - 0.55) / 1.45)
    opacity = Math.max(opacity, BASE_OPACITY + echo * 0.52)
  }

  if (id === "2,2") {
    const beat = 0.5 + 0.5 * Math.sin(phase * Math.PI * PATH_LEN)
    opacity = Math.max(opacity, MID_OPACITY + beat * 0.22)
  }

  const softFill = Math.max(0, 1 - Math.sqrt(x * x + y * y) / 2.35) * 0.1
  return Math.min(HIGH_OPACITY, opacity + softFill)
}

const dotEls = ref<HTMLSpanElement[]>([])
let rafId = 0
let startTs = 0

function paint(phase: number) {
  const els = dotEls.value
  for (let i = 0; i < cells.length; i += 1) {
    const c = cells[i]!
    const el = els[i]
    if (!el) continue
    el.style.opacity = String(opacityForCell(c.id, c.x, c.y, phase))
  }
}

function tick(ts: number) {
  if (!startTs) startTs = ts
  const phase = ((ts - startTs) % CYCLE_MS) / CYCLE_MS
  paint(phase)
  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduced) {
    paint(0.12)
    return
  }
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="vertex-relay" role="img" aria-label="gocanto">
    <div
      v-for="(count, row) in ROW_COUNTS"
      :key="row"
      class="vertex-relay__row"
    >
      <span
        v-for="col in count"
        :key="col"
        ref="dotEls"
        class="vertex-relay__dot"
      />
    </div>
  </div>
</template>

<style scoped>
.vertex-relay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.vertex-relay__row {
  display: flex;
  justify-content: center;
  gap: 3px;
}

.vertex-relay__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.1;
}
</style>
