<script setup lang="ts">
import type { ListboxFilterProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { Search } from "lucide-vue-next";
import { ListboxFilter, useForwardProps } from "reka-ui";
import { cn } from "@/lib/utils";
import { useCommand } from ".";

defineOptions({
    inheritAttrs: false,
});

const props = defineProps<
    ListboxFilterProps & {
        class?: HTMLAttributes["class"];
    }
>();

const delegatedProps = reactiveOmit(props, "class");

const forwardedProps = useForwardProps(delegatedProps);

const { filterState } = useCommand();
</script>

<template>
    <div
        data-slot="command-input-wrapper"
        class="cmd-input-wrapper flex h-[52px] items-center gap-3 px-4"
    >
        <Search class="size-[18px] shrink-0 text-muted-foreground" />
        <ListboxFilter
            v-bind="{ ...forwardedProps, ...$attrs }"
            v-model="filterState.search"
            data-slot="command-input"
            auto-focus
            :class="
                cn(
                    'placeholder:text-muted-foreground flex h-full w-full bg-transparent text-[15px] font-normal outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
                    props.class,
                )
            "
        />
        <kbd
            class="cmd-kbd inline-flex h-6 items-center rounded-md px-1.5 text-[11px] font-medium text-muted-foreground shrink-0"
            >Esc</kbd
        >
    </div>
</template>
