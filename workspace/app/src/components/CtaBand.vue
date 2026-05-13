<script setup lang="ts">
import { profile } from "@gocanto/data";

const email = profile.data.email;
const mailto = `mailto:${email}`;
</script>

<template>
    <section class="cta-grid frame-section">
        <div class="cta-cell">
            <h3>Ready to build? Start with a free conversation about your <b>system</b> or <b>team</b>.</h3>
            <p>Walk through architecture, hiring, or a specific blocker. No pitch.</p>
            <div class="cta-actions">
                <a :href="mailto" class="btn primary">Get in touch</a>
                <a href="#work" class="btn ghost">See work</a>
            </div>
        </div>
        <div class="cta-cell">
            <h3>Explore engineering leadership with an in-depth review of your stack.</h3>
            <p>For founders and CTOs who want a second pair of eyes on what's shipping.</p>
            <div class="cta-actions">
                <a :href="mailto" class="btn ghost">Book a review</a>
            </div>
        </div>
    </section>
</template>
