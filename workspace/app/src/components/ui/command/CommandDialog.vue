<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { useForwardPropsEmits } from "reka-ui";
import { cn } from "#app/lib/utils";
import Command from "#app/components/ui/command/Command.vue";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "#app/components/ui/dialog";

const props = withDefaults(
    defineProps<
        DialogRootProps & {
            title?: string;
            description?: string;
            contentClass?: HTMLAttributes["class"];
        }
    >(),
    {
        title: "Command Palette",
        description: "Search for a command to run...",
    },
);

const emits = defineEmits<DialogRootEmits>();
const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
    <Dialog v-slot="slotProps" v-bind="forwarded">
        <DialogContent
            :class="
                cn(
                    'cmd-dialog-surface overflow-hidden p-0 sm:max-w-[640px] rounded-[14px]',
                    props.contentClass,
                )
            "
        >
            <DialogHeader class="sr-only">
                <DialogTitle>{{ title }}</DialogTitle>
                <DialogDescription>{{ description }}</DialogDescription>
            </DialogHeader>
            <Command class="bg-transparent">
                <slot v-bind="slotProps" />
            </Command>
        </DialogContent>
    </Dialog>
</template>
