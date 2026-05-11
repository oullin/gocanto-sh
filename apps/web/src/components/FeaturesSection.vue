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
  <section id="work">
    <span class="corner-r" aria-hidden="true"></span>
    <div class="section-inner">
      <div class="section-head center">
        <span class="section-eyebrow">What I do</span>
        <h2 class="section-title">
          Engineering that survives <span class="muted">contact with production.</span>
        </h2>
        <p class="section-sub">
          Architecture, backend systems, reliability, and the technical tradeoffs that decide whether a
          system survives its first real load.
        </p>
      </div>

      <div class="features">
        <div v-for="feature in features" :key="feature.title" class="feature">
          <div class="feature-icon">
            <component :is="iconMap[feature.icon]" :size="20" :stroke-width="1.6" aria-hidden="true" />
          </div>
          <div class="feature-title">{{ feature.title }}</div>
          <p class="feature-desc">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
