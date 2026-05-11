<script setup lang="ts">
import { ExternalLink } from "lucide-vue-next"

import { links, profile } from "@/data"
import BrandIcon from "@/components/BrandIcon.vue"
import SectionHeader from "@/components/SectionHeader.vue"
</script>

<template>
  <section class="page-container border-b">
    <div class="flex justify-center border-x">
      <div class="w-full max-w-5xl pb-20">
        <SectionHeader
          title="Connect"
          :description="`You can find me around the web with the handle @${profile.handle}.`"
        />

        <div class="[mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)]">
          <div class="grid gap-x-6 rounded-md border bg-background px-6 pb-10 pt-6 md:grid-cols-2">
            <a
              v-for="link in links"
              :key="link.href"
              :href="link.href"
              target="_blank"
              rel="noreferrer"
              class="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border-b border-dashed p-3 hover:bg-secondary"
            >
              <span class="flex size-12 items-center justify-center rounded-md border border-foreground/5 bg-muted">
                <BrandIcon :name="link.icon" />
              </span>
              <span class="space-y-0.5 overflow-hidden">
                <span class="block text-sm font-medium">{{ link.label }}</span>
                <span class="block truncate text-sm text-muted-foreground">{{ link.description }}</span>
              </span>
              <ExternalLink class="size-4 text-muted-foreground" aria-hidden="true" />
            </a>
          </div>
        </div>

        <p class="mx-auto max-w-lg px-4 text-center text-sm font-light text-muted-foreground md:text-base">
          {{ profile.contact }}
          <a class="font-semibold text-primary hover:underline" :href="profile.cta.primary.href" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </p>
      </div>
    </div>
  </section>
</template>
