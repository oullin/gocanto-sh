<script setup lang="ts">
import { ExternalLink } from "lucide-vue-next"

import type { ProofLink } from "@data"
import Button from "@ui/Button.vue"

defineProps<{
  items: ProofLink[]
}>()
</script>

<template>
  <div class="relative">
    <div class="flex w-full flex-wrap justify-center gap-3 p-3 pt-10">
      <Button
        v-for="item in items"
        :key="item.href"
        as="a"
        variant="outline"
        :href="item.href"
        target="_blank"
        rel="noreferrer"
        class="h-auto w-fit rounded-sm p-1 normal-case hover:bg-muted"
      >
        <div class="flex items-center justify-center gap-2 pl-3">
          <h3 class="text-base font-semibold md:text-xl">{{ item.label }}</h3>
          <ExternalLink class="size-10 p-3 md:size-12" aria-hidden="true" />
        </div>
      </Button>
    </div>
  </div>
</template>
