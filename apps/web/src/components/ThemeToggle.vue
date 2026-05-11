<script setup lang="ts">
import type { AcceptableValue } from "reka-ui"
import { Check, Laptop, Moon, Palette, Sun } from "lucide-vue-next"

import { accentOptions, useTheme, type AccentColor, type ThemePreference } from "@/composables/useTheme"
import { cn } from "@lib/utils"
import Button from "@ui/Button.vue"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select"

const { accent, preference, setAccent, setTheme } = useTheme()

const options: {
  icon: typeof Laptop
  label: string
  value: ThemePreference
}[] = [
  { icon: Laptop, label: "System", value: "system" },
  { icon: Moon, label: "Dark", value: "dark" },
  { icon: Sun, label: "Light", value: "light" },
]

function handleAccentChange(value: AcceptableValue) {
  if (typeof value === "string" && accentOptions.some((option) => option.value === value)) {
    setAccent(value as AccentColor)
  }
}
</script>

<template>
  <div class="relative z-50 flex justify-end border-b bg-background/95 px-4 py-3 backdrop-blur">
    <div class="page-container flex flex-wrap justify-end gap-2">
      <div class="inline-flex gap-1 rounded-md border bg-background p-1" aria-label="Theme">
        <Button
          v-for="option in options"
          :key="option.value"
          type="button"
          variant="ghost"
          size="sm"
          :aria-pressed="preference === option.value"
          :title="`${option.label} theme`"
          :class="
            cn(
              'h-9 min-w-9 rounded-sm px-3 text-xs text-muted-foreground sm:w-28',
              preference === option.value && 'bg-primary text-primary-foreground',
            )
          "
          @click="setTheme(option.value)"
        >
          <component :is="option.icon" class="size-4" aria-hidden="true" />
          <span class="hidden sm:inline">{{ option.label }}</span>
          <Check v-if="preference === option.value" class="hidden size-3 sm:inline" aria-hidden="true" />
        </Button>
      </div>
      <Select :model-value="accent" @update:model-value="handleAccentChange">
        <SelectTrigger
          aria-label="Accent color"
          class="h-[46px] w-[190px] bg-background text-xs font-medium uppercase shadow-none [&>span]:flex [&>span]:items-center [&>span]:gap-2"
        >
          <Palette class="size-4 text-primary" aria-hidden="true" />
          <span class="hidden sm:inline">Color:</span>
          <SelectValue placeholder="Neutral" class="text-foreground" />
        </SelectTrigger>
        <SelectContent
          class="max-h-56 w-[190px] data-[state=closed]:animate-none data-[state=open]:animate-none data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 data-[side=bottom]:slide-in-from-top-0 data-[side=left]:slide-in-from-right-0 data-[side=right]:slide-in-from-left-0 data-[side=top]:slide-in-from-bottom-0"
        >
          <SelectItem
            v-for="option in accentOptions"
            :key="option.value"
            :value="option.value"
            class="text-xs font-medium uppercase"
          >
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
