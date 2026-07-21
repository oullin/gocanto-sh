import type { Ref } from "vue";
import { createContext } from "reka-ui";

/** Command palette root. */
export { default as Command } from "#app/components/ui/command/Command.vue";
/** Dialog wrapper for a command palette. */
export { default as CommandDialog } from "#app/components/ui/command/CommandDialog.vue";
/** Empty-state content for command results. */
export { default as CommandEmpty } from "#app/components/ui/command/CommandEmpty.vue";
/** Group container for command items. */
export { default as CommandGroup } from "#app/components/ui/command/CommandGroup.vue";
/** Search input for a command palette. */
export { default as CommandInput } from "#app/components/ui/command/CommandInput.vue";
/** Selectable command result. */
export { default as CommandItem } from "#app/components/ui/command/CommandItem.vue";
/** Scrollable command-result list. */
export { default as CommandList } from "#app/components/ui/command/CommandList.vue";
/** Visual separator between command groups. */
export { default as CommandSeparator } from "#app/components/ui/command/CommandSeparator.vue";
/** Keyboard-shortcut hint for a command. */
export { default as CommandShortcut } from "#app/components/ui/command/CommandShortcut.vue";

/** Command context accessors shared by palette descendants. */
export const [useCommand, provideCommandContext] = createContext<{
    allItems: Ref<Map<string, string>>;
    allGroups: Ref<Map<string, Set<string>>>;
    refreshFilter: () => void;
    filterState: {
        search: string;
        filtered: { count: number; items: Map<string, number>; groups: Set<string> };
    };
}>("Command");

/** Command-group context accessors shared by grouped results. */
export const [useCommandGroup, provideCommandGroupContext] = createContext<{
    id?: string;
}>("CommandGroup");
