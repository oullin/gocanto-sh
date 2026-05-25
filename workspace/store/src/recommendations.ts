import { recommendationItems } from "./recommendations/items";

import type { RecommendationsFixture } from "./types";

export const recommendations = {
    version: "1.0.7",
    data: recommendationItems,
} as const satisfies RecommendationsFixture;
