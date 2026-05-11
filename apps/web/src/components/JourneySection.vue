<script setup lang="ts">
import { profile } from "@/data"
import SectionHeader from "@/components/SectionHeader.vue"
</script>

<template>
  <section class="relative page-container">
    <div class="border-x border-b pb-20">
      <SectionHeader title="My Engineering Journey" />
      <div class="flex flex-col items-center justify-center space-y-6 px-4">
        <p
          v-for="paragraph in profile.journey"
          :key="paragraph"
          class="max-w-3xl text-center text-sm leading-7 text-muted-foreground xl:text-base"
        >
          {{ paragraph }}
        </p>
      </div>
    </div>
  </section>
</template>
