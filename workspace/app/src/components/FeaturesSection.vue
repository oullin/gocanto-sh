<script setup lang="ts">
import {
  Activity,
  Code2,
  Home,
  Lock,
  Server,
  Shield,
  type LucideIcon,
} from "lucide-vue-next"

import SectionCorners from "@components/SectionCorners.vue"
import { features } from "@data"
import type { FeatureIcon } from "@data"

const iconMap: Record<FeatureIcon, LucideIcon> = {
  architecture: Home,
  backend: Server,
  leadership: Shield,
  reliability: Activity,
  security: Lock,
  ai: Code2,
}
</script>

<template>
  <section id="work" class="relative border-b border-border">
    <SectionCorners />
    <div class="mx-auto max-w-page px-6 py-[120px]">
      <div class="mx-auto mb-16 max-w-[720px] text-center">
        <span class="font-mono text-xs tracking-[0.02em] text-fg-3">What I do</span>
        <h2
          class="mt-3.5 text-[clamp(32px,4vw,48px)] font-semibold leading-[1.08] tracking-[-0.04em]"
        >
          Engineering that survives <span class="text-fg-3">contact with production.</span>
        </h2>
        <p class="mx-auto mt-[18px] max-w-[580px] text-[16.5px] leading-[1.55] text-fg-2">
          Architecture, backend systems, reliability, and the technical tradeoffs that decide whether a
          system survives its first real load.
        </p>
      </div>

      <div
        class="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border max-[900px]:grid-cols-1"
      >
        <div
          v-for="feature in features"
          :key="feature.title"
          class="relative flex min-h-[220px] flex-col bg-background px-7 pb-9 pt-8"
        >
          <div class="mb-5 grid size-8 place-items-center text-foreground">
            <component :is="iconMap[feature.icon]" :size="20" :stroke-width="1.6" aria-hidden="true" />
          </div>
          <div class="text-base font-semibold tracking-[-0.02em]">{{ feature.title }}</div>
          <p class="mt-2.5 text-[14.5px] leading-[1.55] text-fg-2">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
