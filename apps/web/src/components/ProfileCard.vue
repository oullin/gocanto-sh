<script setup lang="ts">
import { Plus } from "lucide-vue-next"

import { Card } from "@ui/card"

defineProps<{
  imageUrl: string
  name: string
}>()
</script>

<template>
  <Card
    class="relative mx-auto my-6 flex h-[336px] w-full max-w-[250px] flex-col items-start rounded-none border-primary/10 p-4 shadow-none md:h-[28rem] md:max-w-sm"
  >
    <Plus class="absolute -left-3 -top-3 text-primary" aria-hidden="true" />
    <Plus class="absolute -bottom-3 -left-3 text-primary" aria-hidden="true" />
    <Plus class="absolute -right-3 -top-3 text-primary" aria-hidden="true" />
    <Plus class="absolute -bottom-3 -right-3 text-primary" aria-hidden="true" />

    <div class="h-full w-full overflow-hidden">
      <img
        :src="imageUrl"
        :alt="`${name} portrait`"
        height="700"
        width="700"
        class="h-full w-full origin-center scale-[1.02] object-cover"
      />
    </div>
  </Card>
</template>
