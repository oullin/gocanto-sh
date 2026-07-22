<script setup lang="ts">
import { defineAsyncComponent, hydrateOnInteraction, onBeforeUnmount, onMounted, ref } from "vue";
import { Search } from "lucide-vue-next";
import { useGlobalSearch } from "#app/lib/globalSearch";

const scrolled = ref(false);
const { openSearch } = useGlobalSearch();

const MobileNavSheet = defineAsyncComponent(
    {
        loader: () => import("#app/components/MobileNavSheet.vue"),
        hydrate: hydrateOnInteraction("click"),
    },
);

const navItems = [
    { href: "#about", label: "About" },
    { href: "#work", label: "Work" },
    { href: "#projects", label: "Projects" },
    { href: "https://writing.gocanto.sh/", label: "Writing" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#bio", label: "Bio" },
    { href: "#skills", label: "Skills" },
];

const onScroll = () => {
    scrolled.value = window.scrollY > 8;
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
            <a href="/" class="nav-brand" aria-label="gocanto home">
                <span class="logo logo--mark" aria-hidden="true">
                    <img
                        src="/avatar-128.jpg"
                        srcset="/avatar-128.jpg 1x, /avatar-128.jpg 2x"
                        alt=""
                        width="28"
                        height="28"
                        decoding="async"
                        fetchpriority="low"
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

            <MobileNavSheet :items="navItems" />
        </div>
    </header>
</template>
