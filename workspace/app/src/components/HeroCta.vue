<script setup lang="ts">
import { profile } from "@gocanto/store";

const mailto = `mailto:${profile.data.email}`;
</script>

<template>
    <section class="hero-cta">
        <a :href="mailto" class="pill">
            <span class="dot" aria-hidden="true"></span>
            Get in touch
        </a>
    </section>
</template>
