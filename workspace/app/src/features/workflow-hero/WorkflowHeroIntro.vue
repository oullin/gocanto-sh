<script setup lang="ts">
import { ArrowUpRight, Handshake } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { profile } from "@gocanto/store";

import { useTestimonialProof } from "@features/workflow-hero/useTestimonialProof";
import WorkflowProof from "@features/workflow-hero/WorkflowProof.vue";

const mailto = "mailto:" + profile.data.email;
const { proofAvatars, proofLoaded, proofSkeletons, testimonialCount } = useTestimonialProof();
</script>

<template>
    <div class="wf-hero__intro">
        <div class="wf-hero__frame">
            <div class="wf-hero__copy">
                <span class="wf-badge">
                    <span class="wf-badge__new">
                        <Handshake class="size-3.5" aria-hidden="true" />
                    </span>
                    <span>Open to work · Fractional CTO · Principal Engineer</span>
                </span>

                <h1 id="hero-title" class="wf-hero__title">
                    AI-accelerated software for regulated industries
                </h1>

                <p class="wf-hero__lede">
                    I build production-grade backends for fintech, banking, and e-commerce: payment
                    integrations, event pipelines, legacy modernization, and practical AI agents
                    that ship fast and pass audit.
                </p>

                <div class="wf-hero__ctas">
                    <Button as="a" :href="mailto" variant="outline" class="wf-cta-primary">
                        <ArrowUpRight class="size-4" aria-hidden="true" />
                        Book a review
                    </Button>
                </div>

                <WorkflowProof
                    :avatars="proofAvatars"
                    :loaded="proofLoaded"
                    :skeletons="proofSkeletons"
                    :testimonial-count="testimonialCount"
                />
            </div>
        </div>
    </div>
</template>
