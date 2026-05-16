<script setup lang="ts">
import { links, profile } from "@gocanto/store";

const mailto = `mailto:${profile.data.email}`;
const linkedinUrl = links.data.find((l) => l.name === "linkedin")?.url ?? mailto;
</script>

<template>
    <section id="engage">
        <div class="engage">
            <div>
                <span class="kicker">How to engage</span>
                <h2>Let's see if I'm a fit.</h2>
                <p>
                    Three ways in: an honest two-hour architecture review, a real conversation about a
                    role, or a no-strings hello. Pick whichever fits.
                </p>
            </div>
            <div class="ctas">
                <a class="btn primary" :href="mailto">
                    <span class="what">
                        <span class="label">Book a 2-hour architecture review</span>
                        <span class="hint">For founders &amp; CTOs · paid, fixed scope</span>
                    </span>
                    <span class="arrow">→</span>
                </a>
                <a class="btn" :href="linkedinUrl" target="_blank" rel="noopener noreferrer">
                    <span class="what">
                        <span class="label">Talk about a role</span>
                        <span class="hint">For recruiters · LinkedIn or email</span>
                    </span>
                    <span class="arrow">→</span>
                </a>
                <a class="btn" :href="mailto">
                    <span class="what">
                        <span class="label">Just say hi</span>
                        <span class="hint">Engineer-to-engineer, or genuinely curious. Both welcome.</span>
                    </span>
                    <span class="arrow">→</span>
                </a>
            </div>
        </div>
    </section>
</template>
