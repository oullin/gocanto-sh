import { computed, onMounted, ref } from "vue";
import { AVATAR_BASE_URL, Recommendations } from "@gocanto/domain";

import type { ProofAvatar } from "#app/features/workflow-hero";

/** Loads and prepares testimonial counts and avatars for the workflow hero. */
export const useTestimonialProof = () => {
    const proofAvatars = ref<ProofAvatar[]>(
    	[],
    );

    const testimonialCount = ref(0);
    const proofSkeletons = [0, 1, 2, 3] as const;

    const proofLoaded = computed(() => testimonialCount.value > 0 && proofAvatars.value.length > 0);

    onMounted(async () => {
        const { recommendations } = await import("@gocanto/store/recommendations");

        const unique = Recommendations.unique(recommendations.data);
        const sorted = Recommendations.sortNewestFirst(unique);

        testimonialCount.value = unique.length;
        proofAvatars.value = sorted.slice(0, 4).map((r) => ({
            src: AVATAR_BASE_URL + r.person.avatar,
            alt: r.person.full_name,
        }));
    });

    return { proofAvatars, proofLoaded, proofSkeletons, testimonialCount };
};
