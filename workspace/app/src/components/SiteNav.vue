<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Menu, Search } from "lucide-vue-next";
import { openGlobalSearch } from "@lib/globalSearch";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const scrolled = ref(false);

const navItems = [
    { href: "#about", label: "About" },
    { href: "#work", label: "Work" },
    { href: "#projects", label: "Projects" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#bio", label: "Bio" },
    { href: "#skills", label: "Skills" },
];

const onScroll = () => {
    scrolled.value = window.scrollY > 8;
};

const openSearch = () => {
    openGlobalSearch();
};

onMounted(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
});
</script>

<template>
    <header class="nav" :class="{ 'is-scrolled': scrolled }">
        <div class="nav-inner">
            <a href="#" class="nav-brand" aria-label="gocanto home">
                <span class="logo logo--mark" aria-hidden="true">
                    <img
                        src="/avatar-128.jpg"
                        srcset="/avatar-128.jpg 1x, /avatar-128.jpg 2x"
                        alt=""
                        width="28"
                        height="28"
                    />
                </span>
                <span class="nav-brand__name">gocanto</span>
            </a>

            <nav class="nav-menu" aria-label="Primary">
                <a v-for="item in navItems" :key="item.href" :href="item.href" class="link">
                    {{ item.label }}
                </a>
            </nav>

            <button type="button" class="nav-search" @click="openSearch()" aria-label="Open search">
                <Search class="nav-search__icon" aria-hidden="true" />
                <span>Search…</span>
                <kbd>⌘K</kbd>
            </button>

            <Sheet>
                <SheetTrigger as-child>
                    <button
                        type="button"
                        class="nav-menu-trigger"
                        aria-label="Open navigation menu"
                    >
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
                            />
                        </span>
                        <span class="nav-brand__name">gocanto</span>
                    </div>

                    <nav class="nav-sheet__menu" aria-label="Mobile primary">
                        <SheetClose v-for="item in navItems" :key="item.href" as-child>
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
        </div>
    </header>
</template>
