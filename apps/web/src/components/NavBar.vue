<script setup lang="ts">
import { navLinks, profile } from "@data"
</script>

<template>
  <nav class="nav">
    <div class="nav-inner">
      <a class="brand" href="#">
        <span class="brand-logo">G</span>
        <span>{{ profile.handle }}</span>
        <span class="brand-sep">/</span>
        <span class="brand-sub">portfolio</span>
      </a>
      <div class="nav-links">
        <a v-for="link in navLinks" :key="link.href" class="nav-link" :href="link.href">
          {{ link.label }}
        </a>
      </div>
      <div class="nav-actions">
        <a class="nav-link" :href="profile.github" target="_blank" rel="noreferrer">GitHub</a>
        <a class="nav-cta" href="#cta">Hire me</a>
      </div>
    </div>
  </nav>
</template>
