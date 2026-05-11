<script setup lang="ts">
import CodeShowcase from "@components/CodeShowcase.vue"
import { heroCopy } from "@data"
</script>

<template>
  <header class="hero">
    <div class="hero-glow"></div>
    <span class="corner-r" aria-hidden="true"></span>
    <div class="hero-inner">
      <span class="eyebrow">
        <span class="eyebrow-dot"></span>
        {{ heroCopy.eyebrow }}
      </span>

      <h1 class="hero-title">{{ heroCopy.title }}</h1>

      <p class="hero-sub">{{ heroCopy.subtitle }}</p>

      <div class="hero-actions">
        <a class="btn btn-primary" :href="heroCopy.primary.href">{{ heroCopy.primary.label }}</a>
        <a
          class="btn btn-ghost"
          :href="heroCopy.secondary.href"
          :target="heroCopy.secondary.external ? '_blank' : undefined"
          :rel="heroCopy.secondary.external ? 'noreferrer' : undefined"
        >
          {{ heroCopy.secondary.label }}
        </a>
      </div>
    </div>

    <CodeShowcase />
  </header>
</template>
