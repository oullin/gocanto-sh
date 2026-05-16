<script setup lang="ts">
import ThemeToggle from "@components/ThemeToggle.vue";
</script>

<template>
    <header class="nav">
        <div class="nav-inner">
            <a href="#" class="logo" aria-label="gocanto home">
                <img src="/avatar.jpg" alt="" width="26" height="26" />
            </a>
            <a href="#work" class="link">Work</a>
            <a href="#testimonials" class="link">Testimonials</a>
            <a href="#engage" class="link">Book a review</a>
            <div class="spacer"></div>
            <ThemeToggle />
        </div>
    </header>
</template>
