<script setup lang="ts">
import type { ListboxItemEmits, ListboxItemProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit, useCurrentElement } from "@vueuse/core";
import { ListboxItem, useForwardPropsEmits, useId } from "reka-ui";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { cn } from "#app/lib/utils";
import { useCommand, useCommandGroup } from ".";

const props = defineProps<
    ListboxItemProps & {
        class?: HTMLAttributes["class"];
        searchValue?: string;
    }
>();

const emits = defineEmits<ListboxItemEmits>();
const delegatedProps = reactiveOmit(props, "class");
const forwarded = useForwardPropsEmits(delegatedProps, emits);
const id = useId();
const { filterState, allItems, allGroups, refreshFilter } = useCommand();
const groupContext = useCommandGroup();

const isRender = computed(() => {
    if (!filterState.search) {
        return true;
    } else {
        const filteredCurrentItem = filterState.filtered.items.get(id);
        // If the filtered items is undefined means not in the all times map yet
        // Do the first render to add into the map
        if (filteredCurrentItem === undefined) {
            return true;
        }

        // Check with filter
        return filteredCurrentItem > 0;
    }
});

const itemRef = ref();
const currentElement = useCurrentElement(itemRef);

const currentElementText = () => {
    const element = currentElement.value;

    return element instanceof Element ? (element.textContent ?? "") : "";
};

const itemSearchValue = () =>
    props.searchValue ?? (currentElementText() || props.value?.toString() || "");

onMounted(() => {
    if (!(currentElement.value instanceof HTMLElement)) {
        return;
    }

    allItems.value.set(id, itemSearchValue());

    const groupId = groupContext?.id;

    if (groupId) {
        if (!allGroups.value.has(groupId)) {
            allGroups.value.set(groupId, new Set([id]));
        } else {
            allGroups.value.get(groupId)?.add(id);
        }
    }

    refreshFilter();
});

watch(
    () => props.searchValue,
    () => {
        if (!allItems.value.has(id)) {
            return;
        }

        allItems.value.set(id, itemSearchValue());
        refreshFilter();
    },
);

watch(currentElement, () => {
    if (props.searchValue || !allItems.value.has(id)) {
        return;
    }

    allItems.value.set(id, itemSearchValue());
    refreshFilter();
});

onUnmounted(() => {
    allItems.value.delete(id);

    const groupId = groupContext?.id;

    if (groupId) {
        allGroups.value.get(groupId)?.delete(id);
    }

    refreshFilter();
});
</script>

<template>
    <ListboxItem
        v-if="isRender"
        v-bind="forwarded"
        :id="id"
        ref="itemRef"
        data-slot="command-item"
        :class="
            cn(
                'cmd-item [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-hidden select-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
                props.class,
            )
        "
    >
        <slot />
    </ListboxItem>
</template>
