<script setup lang="ts">
import { Check } from "lucide-vue-next"
import { computed, ref } from "vue"

import SectionCorners from "@components/SectionCorners.vue"
import { journeyHeading, journeyTabs } from "@data"
import type { JourneyTabKey } from "@data"

const active = ref<JourneyTabKey>(journeyTabs[0].key)

const activeTab = computed(
  () => journeyTabs.find((tab) => tab.key === active.value) ?? journeyTabs[0],
)
</script>

<template>
  <section id="journey" class="relative border-b border-border">
    <SectionCorners />
    <div class="mx-auto max-w-page px-6 py-[120px]">
      <div
        class="grid grid-cols-[1fr_1.2fr] items-center gap-20 max-[900px]:grid-cols-1 max-[900px]:gap-10"
      >
        <div>
          <span class="font-mono text-xs tracking-[0.02em] text-fg-3">{{ journeyHeading.eyebrow }}</span>
          <h3
            class="mt-3.5 text-[clamp(28px,3.4vw,38px)] font-semibold leading-[1.1] tracking-[-0.035em]"
          >{{ journeyHeading.title }}</h3>
          <p class="mt-[18px] text-base leading-[1.6] text-fg-2">{{ journeyHeading.lead }}</p>
          <ul class="mt-7 flex flex-col gap-3.5">
            <li
              v-for="item in journeyHeading.highlights"
              :key="item"
              class="flex list-none gap-3 text-[14.5px] text-fg-2 [&>svg]:mt-1 [&>svg]:shrink-0 [&>svg]:text-accent"
            >
              <Check :size="14" :stroke-width="2" aria-hidden="true" />
              {{ item }}
            </li>
          </ul>

          <div class="mt-9 flex flex-wrap gap-2">
            <span
              v-for="chip in journeyHeading.stack"
              :key="chip"
              class="rounded-md border border-border-strong bg-bg-1 px-3.5 py-2 font-mono text-[12.5px] text-fg-2"
            >{{ chip }}</span>
          </div>
        </div>

        <div>
          <div
            class="mb-3.5 inline-flex rounded-lg border border-border bg-bg-1 p-[3px]"
            role="tablist"
          >
            <button
              v-for="tab in journeyTabs"
              :key="tab.key"
              type="button"
              class="cursor-pointer rounded-[5px] border-0 bg-transparent px-3 py-1.5 font-mono text-[12.5px] text-fg-3 transition-all duration-150"
              :class="active === tab.key && 'bg-bg-2 text-foreground'"
              role="tab"
              :aria-selected="active === tab.key"
              @click="active = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
          <div
            class="overflow-hidden rounded-xl border border-border-strong bg-[#0a0a0a] font-mono text-[12.5px]"
          >
            <div
              class="flex items-center gap-2 border-b border-border px-3.5 py-2.5 text-[11.5px] text-fg-3"
            >
              <span class="size-2 rounded-full bg-[#ef4444]"></span>
              <span class="size-2 rounded-full bg-[#f59e0b]"></span>
              <span class="size-2 rounded-full bg-[#22c55e]"></span>
              <span class="ml-2">~/career.json</span>
            </div>
            <div class="px-6 py-[22px] leading-[1.9] text-fg-2">
              <div v-for="entry in activeTab.entries" :key="entry.label">
                <span class="inline-block w-[110px] text-[var(--fg-4)]">{{ entry.label }}</span>
                <span class="text-foreground">{{ entry.value }}</span>
              </div>
              <div>
                <span class="inline-block w-[110px] text-[var(--fg-4)]">stack:</span>
                <span
                  v-for="chip in activeTab.stack"
                  :key="chip"
                  class="mr-1 inline-block rounded bg-accent-soft px-2 py-px text-[11px] text-accent"
                >{{ chip }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
