import { recommendationItems } from "#store/recommendations/items";

import type { RecommendationsFixture } from "#store/types";

export const recommendations = {
    version: "1.0.7",
    data: recommendationItems,
} as const satisfies RecommendationsFixture;
