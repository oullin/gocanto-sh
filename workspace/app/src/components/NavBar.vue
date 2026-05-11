<script setup lang="ts">
import { navLinks, profile } from "@data"
</script>

<template>
  <nav class="nav">
    <div class="nav-inner">
      <a class="brand" href="#">
        <img class="brand-logo" :src="profile.avatarUrl" :alt="profile.name" />
        <span>{{ profile.handle }}</span>
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
