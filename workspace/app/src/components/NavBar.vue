<script setup lang="ts">
import { defineAsyncComponent } from "vue"
import VertexRelaySkeleton from "@components/VertexRelaySkeleton.vue"
import { navLinks, profile } from "@data"

const VertexRelay = defineAsyncComponent({
  loader: () => import("@components/VertexRelay.vue"),
  loadingComponent: VertexRelaySkeleton,
  delay: 0,
})
</script>

<template>
  <nav class="nav">
    <div class="nav-inner">
      <a class="brand" href="#">
        <VertexRelay class="brand-logo" />
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
