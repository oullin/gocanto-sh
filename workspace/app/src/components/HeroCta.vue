<script setup lang="ts">
import { profile } from "@gocanto/store";

const mailto = `mailto:${profile.data.email}`;
</script>

<template>
    <section class="hero-cta">
        <span class="cta-glow-wrap">
            <span class="cta-glow" aria-hidden="true"></span>
            <a :href="mailto" class="pill">
                <span class="dot" aria-hidden="true"></span>
                Get in touch
            </a>
        </span>
    </section>
</template>
