<script setup lang="ts">
import { Github, Globe, Linkedin, Mail, Target } from "lucide-vue-next"
import { computed } from "vue"

import type { IconName } from "@data"

const props = defineProps<{ name: IconName; size?: number }>()
const size = computed(() => props.size ?? 20)
</script>

<template>
  <Linkedin v-if="name === 'linkedin'" :size="size" :stroke-width="1.6" aria-hidden="true" />
  <Github v-else-if="name === 'github'" :size="size" :stroke-width="1.6" aria-hidden="true" />
  <Globe v-else-if="name === 'globe'" :size="size" :stroke-width="1.6" aria-hidden="true" />
  <Target v-else-if="name === 'gravatar'" :size="size" :stroke-width="1.8" aria-hidden="true" />
  <Mail v-else-if="name === 'mail'" :size="size" :stroke-width="1.6" aria-hidden="true" />
  <svg
    v-else-if="name === 'bluesky'"
    :width="size"
    :height="size"
    viewBox="0 0 600 530"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      d="M135.7 44.8C202.6 95 274.5 196.6 300.9 251.2c26.4-54.6 98.3-156.2 165.2-206.4C514.4 8.6 592 -19.5 592 69c0 17.7-10.1 148.8-16.1 170.1-20.7 74-96.1 92.9-163.2 81.5 117.3 20 147.1 86.2 82.7 152.4-122.4 125.7-175.8-31.5-189.5-71.7-1.7-5-2.5-7.4-2.9-2.6-.4 4.8-1.2 7.6-2.9 12.6-13.7 40.2-67.1 197.4-189.5 71.7-64.4-66.2-34.6-132.5 82.7-152.4-67.1 11.4-142.5-7.5-163.2-81.5C24.1 217.8 14 86.7 14 69 14-19.5 91.6 8.6 135.7 44.8z"
    />
  </svg>
</template>
