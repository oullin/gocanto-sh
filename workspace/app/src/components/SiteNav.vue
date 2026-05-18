<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { openGlobalSearch } from "@lib/globalSearch";

const scrolled = ref(false);

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
            <a href="#" class="logo logo--mark" aria-label="gocanto home">
                <img
                    src="/avatar-128.jpg"
                    srcset="/avatar-128.jpg 1x, /avatar-128.jpg 2x"
                    alt=""
                    width="36"
                    height="36"
                />
            </a>

            <nav class="nav-menu" aria-label="Primary">
                <a href="#about" class="link">About</a>
                <a href="#skills" class="link">Skills</a>
                <a href="#work" class="link">Work</a>
                <a href="#projects" class="link">Projects</a>
                <a href="#testimonials" class="link">Testimonials</a>
            </nav>

            <div class="spacer"></div>

            <button type="button" class="search-pill" @click="openGlobalSearch()" aria-label="Open search">
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
                <span>Search…</span>
                <kbd>⌘K</kbd>
            </button>
        </div>
    </header>
</template>
