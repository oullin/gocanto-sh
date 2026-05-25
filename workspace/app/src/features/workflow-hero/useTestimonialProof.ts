import { computed, onMounted, ref } from "vue";
import {
    AVATAR_BASE_URL,
    sortRecommendationsNewestFirst,
    uniqueRecommendations,
} from "@gocanto/domain";

import type { ProofAvatar } from "./types";

export const useTestimonialProof = () => {
    const proofAvatars = ref<ProofAvatar[]>([]);
    const testimonialCount = ref(0);
    const proofSkeletons = [0, 1, 2, 3] as const;
    const proofLoaded = computed(() => testimonialCount.value > 0 && proofAvatars.value.length > 0);

    onMounted(async () => {
        const { recommendations } = await import("@gocanto/store/recommendations");
        const unique = uniqueRecommendations(recommendations.data);
        const sorted = sortRecommendationsNewestFirst(unique);

        testimonialCount.value = unique.length;
        proofAvatars.value = sorted.slice(0, 4).map((r) => ({
            src: AVATAR_BASE_URL + r.person.avatar,
            alt: r.person.full_name,
        }));
    });

    return { proofAvatars, proofLoaded, proofSkeletons, testimonialCount };
};
