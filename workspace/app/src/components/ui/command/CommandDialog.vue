<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from "reka-ui"
import { useForwardPropsEmits } from "reka-ui"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Command from "./Command.vue"

const props = withDefaults(defineProps<DialogRootProps & {
  title?: string
  description?: string
}>(), {
  title: "Command Palette",
  description: "Search for a command to run...",
})
const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <Dialog v-slot="slotProps" v-bind="forwarded">
    <DialogContent class="overflow-hidden p-0 sm:max-w-[640px] rounded-xl border-0 shadow-[0_0_0_1px_rgba(255,255,255,0.08),_0_24px_48px_rgba(0,0,0,0.5)]">
      <DialogHeader class="sr-only">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>
      <Command class="bg-card">
        <slot v-bind="slotProps" />
      </Command>
    </DialogContent>
  </Dialog>
</template>
