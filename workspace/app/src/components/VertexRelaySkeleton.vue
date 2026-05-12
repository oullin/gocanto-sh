<script setup lang="ts">
const SIZE = 5
const CENTER = 2
</script>

<template>
  <div class="twin-orbit-skeleton" role="img" aria-label="Loading">
    <template v-for="row in SIZE" :key="row">
      <span
        v-for="col in SIZE"
        :key="`${row}-${col}`"
        class="twin-orbit-skeleton__dot"
        :class="{ 'twin-orbit-skeleton__dot--center': row - 1 === CENTER && col - 1 === CENTER }"
      />
    </template>
  </div>
</template>

<style scoped>
.twin-orbit-skeleton {
  display: grid;
  grid-template-columns: repeat(5, 4px);
  grid-auto-rows: 4px;
  gap: 2px;
  color: currentColor;
}

.twin-orbit-skeleton__dot {
  width: 4px;
  height: 4px;
  background: currentColor;
  border-radius: 50%;
  opacity: 0.18;
  animation: twin-orbit-skeleton-pulse 1.83s ease-in-out infinite;
}

.twin-orbit-skeleton__dot--center {
  visibility: hidden;
}

@keyframes twin-orbit-skeleton-pulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.4; }
}

@media (prefers-reduced-motion: reduce) {
  .twin-orbit-skeleton__dot {
    animation: none;
    opacity: 0.25;
  }
}
</style>
