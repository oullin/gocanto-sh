<script setup lang="ts">
import { profile } from "@/data"
import SectionHeader from "@/components/SectionHeader.vue"
import Button from "@/components/ui/Button.vue"
</script>

<template>
  <section class="page-container">
    <div class="border-x border-b px-4 py-10">
      <SectionHeader :title="profile.cta.heading" :description="profile.cta.description">
        <div class="flex w-full flex-wrap items-center justify-center gap-2 pt-2">
          <Button as="a" size="xl" variant="outline" :href="profile.cta.secondary.href" target="_blank" rel="noreferrer">
            {{ profile.cta.secondary.label }}
          </Button>
          <Button as="a" size="xl" :href="profile.cta.primary.href" target="_blank" rel="noreferrer">
            {{ profile.cta.primary.label }}
          </Button>
        </div>
      </SectionHeader>
    </div>
  </section>
</template>
