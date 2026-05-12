<script setup lang="ts">
const ROW_COUNTS = [3, 4, 5, 4, 3] as const
</script>

<template>
  <div class="vertex-relay-skeleton" role="img" aria-label="Loading">
    <div
      v-for="(count, row) in ROW_COUNTS"
      :key="row"
      class="vertex-relay-skeleton__row"
    >
      <span
        v-for="col in count"
        :key="col"
        class="vertex-relay-skeleton__dot"
      />
    </div>
  </div>
</template>

<style scoped>
.vertex-relay-skeleton {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.vertex-relay-skeleton__row {
  display: flex;
  justify-content: center;
  gap: 3px;
}

.vertex-relay-skeleton__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.18;
  animation: vertex-relay-skeleton-pulse 1.83s ease-in-out infinite;
}

@keyframes vertex-relay-skeleton-pulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.4; }
}

@media (prefers-reduced-motion: reduce) {
  .vertex-relay-skeleton__dot {
    animation: none;
    opacity: 0.25;
  }
}
</style>
