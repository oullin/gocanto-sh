<script setup lang="ts">
import { Check } from "lucide-vue-next"
import { computed, ref } from "vue"

import { journeyHeading, journeyTabs } from "@data"
import type { JourneyTabKey } from "@data"

const active = ref<JourneyTabKey>(journeyTabs[0].key)

const activeTab = computed(
  () => journeyTabs.find((tab) => tab.key === active.value) ?? journeyTabs[0],
)
</script>

<template>
  <section id="journey">
    <span class="corner-r" aria-hidden="true"></span>
    <div class="section-inner">
      <div class="split">
        <div class="split-copy">
          <span class="section-eyebrow">{{ journeyHeading.eyebrow }}</span>
          <h3 style="margin-top: 14px">{{ journeyHeading.title }}</h3>
          <p class="lead">{{ journeyHeading.lead }}</p>
          <ul class="split-list">
            <li v-for="item in journeyHeading.highlights" :key="item">
              <Check :size="14" :stroke-width="2" aria-hidden="true" />
              {{ item }}
            </li>
          </ul>

          <div class="stack-row">
            <span v-for="chip in journeyHeading.stack" :key="chip" class="stack-chip">{{ chip }}</span>
          </div>
        </div>

        <div>
          <div class="split-tabs" role="tablist">
            <button
              v-for="tab in journeyTabs"
              :key="tab.key"
              type="button"
              class="split-tab"
              :class="{ active: active === tab.key }"
              role="tab"
              :aria-selected="active === tab.key"
              @click="active = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
          <div class="split-visual">
            <div class="sv-head">
              <span class="dot" style="background: #ef4444"></span>
              <span class="dot" style="background: #f59e0b"></span>
              <span class="dot" style="background: #22c55e"></span>
              <span style="margin-left: 8px">~/career.json</span>
            </div>
            <div class="sv-body">
              <div v-for="entry in activeTab.entries" :key="entry.label">
                <span class="label">{{ entry.label }}</span>
                <span class="val">{{ entry.value }}</span>
              </div>
              <div>
                <span class="label">stack:</span>
                <span v-for="chip in activeTab.stack" :key="chip" class="tag">{{ chip }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
