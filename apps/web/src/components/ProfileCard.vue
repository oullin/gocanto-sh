<script setup lang="ts">
import { Plus } from "lucide-vue-next"

defineProps<{
  imageUrl: string
  name: string
}>()
</script>

<template>
  <div
    class="relative mx-auto my-6 flex h-[336px] w-full max-w-[250px] flex-col items-start rounded-2xl border border-primary/10 p-4 md:h-[28rem] md:max-w-sm"
  >
    <Plus class="absolute -left-4 -top-4 text-primary" aria-hidden="true" />
    <Plus class="absolute -bottom-4 -left-4 text-primary" aria-hidden="true" />
    <Plus class="absolute -right-4 -top-4 text-primary" aria-hidden="true" />
    <Plus class="absolute -bottom-4 -right-4 text-primary" aria-hidden="true" />

    <img
      :src="imageUrl"
      :alt="`${name} portrait`"
      height="700"
      width="700"
      class="h-[304px] w-full rounded-sm object-cover md:h-[354px]"
    />

    <div class="-mt-17 w-full rounded-b-md bg-gradient-to-b from-black/0 to-black text-white md:-mt-24">
      <h1 class="z-20 w-full text-center text-[40px] font-black uppercase tracking-normal md:text-[60px]">
        {{ name }}
      </h1>
    </div>
  </div>
</template>
