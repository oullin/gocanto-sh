<script setup lang="ts">
import { footerCopy, profile } from "@data"
</script>

<template>
  <footer class="mx-auto max-w-page px-6 pb-16 pt-12">
    <div
      class="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-7"
    >
      <div class="flex items-center gap-2.5 text-[14.5px] font-medium">
        <img
          class="block size-7 rounded-[5px] text-foreground"
          :src="profile.avatarUrl"
          :alt="profile.name"
        />
        <span>{{ profile.handle }}</span>
      </div>
      <div class="flex items-center gap-2 font-mono text-xs text-fg-2">
        <span class="size-[7px] rounded-full bg-green shadow-[0_0_8px_var(--green)]"></span>
        {{ footerCopy.status }}
      </div>
    </div>
    <div
      class="mt-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[11.5px] text-[var(--fg-4)]"
    >
      <div>{{ footerCopy.copyright }}</div>
      <div>{{ footerCopy.tagline }}</div>
    </div>
  </footer>
</template>
