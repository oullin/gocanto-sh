<script setup lang="ts">
import { ctaCopy } from "@data"
</script>

<template>
  <section id="cta" class="cta">
    <span class="corner-r" aria-hidden="true"></span>
    <span class="corner-l" aria-hidden="true"></span>
    <div class="cta-glow-clip">
      <div class="cta-glow"></div>
    </div>
    <div class="cta-inner">
      <h2 class="cta-title">{{ ctaCopy.title }}</h2>
      <p class="cta-sub">{{ ctaCopy.subtitle }}</p>
      <div class="cta-actions">
        <a class="btn btn-primary" :href="ctaCopy.primary.href" target="_blank" rel="noreferrer">
          {{ ctaCopy.primary.label }}
        </a>
        <a class="btn btn-ghost" :href="ctaCopy.secondary.href" target="_blank" rel="noreferrer">
          {{ ctaCopy.secondary.label }}
        </a>
      </div>
    </div>
  </section>
</template>
