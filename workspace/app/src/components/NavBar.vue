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
  <nav
    class="sticky top-0 z-50 mx-auto max-w-page border-b border-border bg-black/72 backdrop-blur-[14px] backdrop-saturate-[1.8]"
  >
    <span
      class="cross-mark absolute bottom-0 left-0 z-[5] -translate-x-1/2 translate-y-1/2 text-fg-3 max-mid:hidden"
      aria-hidden="true"
    ></span>
    <span
      class="cross-mark absolute bottom-0 right-0 z-[5] translate-x-1/2 translate-y-1/2 text-fg-3 max-mid:hidden"
      aria-hidden="true"
    ></span>

    <div class="mx-auto flex h-[60px] max-w-page items-center gap-7 px-6">
      <a class="flex items-center gap-2.5 text-[14.5px] font-medium" href="#">
        <VertexRelay class="block size-7 rounded-[5px] text-foreground" />
      </a>
      <div class="flex items-center gap-0.5 max-[900px]:hidden">
        <a
          v-for="link in navLinks"
          :key="link.href"
          class="rounded-md px-3 py-1.5 text-[13.5px] text-fg-2 transition-colors duration-150 hover:text-foreground"
          :href="link.href"
        >
          {{ link.label }}
        </a>
      </div>
      <div class="ml-auto flex items-center gap-1">
        <a
          class="rounded-md px-3 py-1.5 text-[13.5px] text-fg-2 transition-colors duration-150 hover:text-foreground"
          :href="profile.github"
          target="_blank"
          rel="noreferrer"
        >GitHub</a>
        <a
          class="rounded-md bg-foreground px-3.5 py-[7px] text-[13px] font-medium text-black transition-colors duration-150 hover:bg-white"
          href="#cta"
        >Hire me</a>
      </div>
    </div>
  </nav>
</template>
