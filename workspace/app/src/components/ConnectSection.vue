<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next"

import ChannelIcon from "@components/ChannelIcon.vue"
import { connectChannels, connectHeading } from "@data"
</script>

<template>
  <section id="connect">
    <span class="corner-r" aria-hidden="true"></span>
    <span class="corner-l" aria-hidden="true"></span>
    <div class="section-inner">
      <div class="section-head center">
        <span class="section-eyebrow">{{ connectHeading.eyebrow }}</span>
        <h2 class="section-title">
          {{ connectHeading.title }}
          <span style="color: var(--accent)">{{ connectHeading.highlight }}</span>{{ connectHeading.trailing }}
        </h2>
        <p class="section-sub">{{ connectHeading.subtitle }}</p>
      </div>

      <div class="connect-grid">
        <a
          v-for="channel in connectChannels"
          :key="channel.name"
          class="connect-card"
          :href="channel.href"
          :target="channel.icon === 'mail' ? undefined : '_blank'"
          :rel="channel.icon === 'mail' ? undefined : 'noreferrer'"
        >
          <div class="connect-head">
            <div class="connect-icon">
              <ChannelIcon :name="channel.icon" />
            </div>
            <span class="connect-arrow">
              <ArrowUpRight :size="14" :stroke-width="1.5" aria-hidden="true" />
            </span>
          </div>
          <div>
            <div class="connect-name">{{ channel.name }}</div>
            <div class="connect-handle">{{ channel.handle }}</div>
          </div>
          <div class="connect-desc">{{ channel.description }}</div>
        </a>
      </div>
    </div>
  </section>
</template>
