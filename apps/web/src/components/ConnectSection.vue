<script setup lang="ts">
import { ExternalLink } from "lucide-vue-next"

import BrandIcon from "@components/BrandIcon.vue"
import SectionHeader from "@components/SectionHeader.vue"
import { links, profile } from "@data"
import Button from "@ui/Button.vue"
import { Card } from "@ui/card"
</script>

<template>
  <section class="page-container border-b">
    <div class="border-x pb-20">
      <SectionHeader
        title="Connect"
        :description="`You can find me around the web with the handle @${profile.handle}.`"
      />

      <div class="mx-auto mt-8 w-full max-w-5xl">
        <div class="[mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)]">
          <Card class="grid gap-x-6 rounded-md bg-background px-6 pb-10 pt-6 shadow-none md:grid-cols-2">
            <Button
              v-for="link in links"
              :key="link.href"
              as="a"
              variant="ghost"
              :href="link.href"
              target="_blank"
              rel="noreferrer"
              class="grid h-auto grid-cols-[auto_1fr_auto] items-center justify-normal gap-3 rounded-md border-b border-dashed p-3 text-left normal-case hover:bg-secondary"
            >
              <span class="flex size-12 items-center justify-center rounded-md border border-foreground/5 bg-muted">
                <BrandIcon :name="link.icon" />
              </span>
              <span class="space-y-0.5 overflow-hidden">
                <span class="block text-sm font-medium">{{ link.label }}</span>
                <span class="block truncate text-sm text-muted-foreground">{{ link.description }}</span>
              </span>
              <ExternalLink class="size-4 text-muted-foreground" aria-hidden="true" />
            </Button>
          </Card>
        </div>

        <p class="mx-auto max-w-lg px-4 text-center text-sm font-light text-muted-foreground md:text-base">
          {{ profile.contact }}
          <Button
            as="a"
            variant="link"
            class="inline h-auto p-0 align-baseline font-semibold normal-case"
            :href="profile.cta.primary.href"
            target="_blank"
            rel="noreferrer"
          >
            {{ profile.cta.primary.label }}
          </Button>
        </p>
      </div>
    </div>
  </section>
</template>
