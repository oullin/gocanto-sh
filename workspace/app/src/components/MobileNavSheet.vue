<script setup lang="ts">
import { Menu, Search } from "lucide-vue-next";
import { useGlobalSearch } from "#app/lib/globalSearch";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "#app/components/ui/sheet";

defineProps<{
    items: Array<{
        href: string;
        label: string;
    }>;
}>();

const { openSearch } = useGlobalSearch();
</script>

<template>
    <Sheet>
        <SheetTrigger as-child>
            <button type="button" class="nav-menu-trigger" aria-label="Open navigation menu">
                <Menu class="nav-menu-trigger__icon" aria-hidden="true" />
            </button>
        </SheetTrigger>

        <SheetContent side="right" class="nav-sheet">
            <SheetTitle class="sr-only">Navigation menu</SheetTitle>
            <SheetDescription class="sr-only">
                Browse page sections or open the global search.
            </SheetDescription>

            <div class="nav-sheet__brand">
                <span class="logo logo--mark" aria-hidden="true">
                    <img
                        src="/avatar-128.jpg"
                        srcset="/avatar-128.jpg 1x, /avatar-128.jpg 2x"
                        alt=""
                        width="28"
                        height="28"
                        loading="lazy"
                        decoding="async"
                    />
                </span>
                <span class="nav-brand__name">gocanto</span>
            </div>

            <nav class="nav-sheet__menu" aria-label="Mobile primary">
                <SheetClose v-for="item in items" :key="item.href" as-child>
                    <a :href="item.href" class="nav-sheet__link">{{ item.label }}</a>
                </SheetClose>
            </nav>

            <hr class="nav-sheet__divider" aria-hidden="true" />

            <SheetClose as-child>
                <button type="button" class="nav-sheet__search" @click="openSearch()">
                    <Search class="nav-search__icon" aria-hidden="true" />
                    <span>Search…</span>
                    <kbd>⌘K</kbd>
                </button>
            </SheetClose>
        </SheetContent>
    </Sheet>
</template>
