<script setup lang="ts">
import { profile } from "@gocanto/store";

const email = profile.data.email;
const mailto = `mailto:${email}`;
const oullinLabsUrl = "https://oullin.io";
</script>

<template>
    <section id="book-a-review" class="cta-grid frame-section">
        <div class="cta-cell">
            <h3>Architecture review for your <b>AI-agentic</b> or <b>backend</b> system.</h3>
            <p>Deep dive on idempotency, audit trails, throughput, and what's about to break. Two hours, written write-up, no pitch.</p>
            <div class="cta-actions">
                <a :href="mailto" class="btn primary">Book a review</a>
                <a href="#work" class="btn ghost">See work</a>
            </div>
        </div>
        <div class="cta-cell">
            <h3>Need a fixed-scope sprint?</h3>
            <p>Oullin Labs ships payment integrations (hara.sh), event pipelines (kuda.sh), and AS/400 modernisation (toku.sh) — agent-accelerated, audit-trail-by-default.</p>
            <div class="cta-actions">
                <a :href="oullinLabsUrl" target="_blank" rel="noopener noreferrer" class="btn ghost">Explore Oullin Labs</a>
            </div>
        </div>
    </section>
</template>
