<script setup lang="ts">
import SectionHeader from "@components/SectionHeader.vue"
import { profile } from "@data"
</script>

<template>
  <section class="relative page-container">
    <div class="border-x border-b pb-20">
      <SectionHeader title="My Engineering Journey" />
      <div class="rich-text mx-auto max-w-3xl px-4 text-center text-muted-foreground [&>p]:my-0 [&>p+p]:mt-6">
        <p
          v-for="paragraph in profile.journey"
          :key="paragraph"
          class="text-sm leading-7 xl:text-base"
        >
          {{ paragraph }}
        </p>
      </div>
    </div>
  </section>
</template>
