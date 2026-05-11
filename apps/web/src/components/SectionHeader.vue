<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <section class="border-grid">
    <div class="container-wrapper">
      <div class="page-container flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
        <h1 class="text-3xl font-medium uppercase tracking-normal xl:text-5xl">
          {{ title }}
        </h1>
        <p v-if="description" class="max-w-3xl text-sm text-muted-foreground xl:text-base">
          {{ description }}
        </p>
        <slot />
      </div>
    </div>
  </section>
</template>
