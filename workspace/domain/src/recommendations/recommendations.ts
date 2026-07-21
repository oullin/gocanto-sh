import { AVATAR_BASE_URL } from "@gocanto/domain/kernel";
import type { RecommendationRecord, RecommendationsFixture } from "@gocanto/store";

import type { TestimonialItem } from "#domain/recommendations/types";

/** Provides pure transformations for recommendation records. */
export class Recommendations {
    private constructor() {}

    /**
     * Removes duplicate recommendations by UUID while preserving encounter order.
     *
     * @param items - Recommendation records to deduplicate.
     * @returns Unique recommendation records.
     */
    public static unique(items: readonly RecommendationRecord[]): readonly RecommendationRecord[] {
        const seen = new Set<string>();
        const unique: RecommendationRecord[] = [];

        for (const item of items) {
            if (seen.has(item.uuid)) {
                continue;
            }

            seen.add(item.uuid);
            unique.push(item);
        }

        return unique;
    }

    /**
     * Sorts recommendations newest first without mutating the input.
     *
     * @param items - Recommendation records to sort.
     * @returns A newest-first copy of the records.
     */
    public static sortNewestFirst(
        items: readonly RecommendationRecord[],
    ): readonly RecommendationRecord[] {
        return [...items].sort((a, b) => b.created_at.localeCompare(a.created_at));
    }

    /**
     * Lists recommendation fixture records newest first.
     *
     * @param fixture - Recommendation fixture to sort.
     * @returns Recommendation records newest first.
     */
    public static listNewestFirst(
        fixture: RecommendationsFixture,
    ): readonly RecommendationRecord[] {
        return Recommendations.sortNewestFirst(fixture.data);
    }

    /**
     * Adapts a recommendation into a testimonial item.
     *
     * @param record - Recommendation record to adapt.
     * @returns A testimonial item.
     */
    public static toTestimonial(record: RecommendationRecord): TestimonialItem {
        return {
            id: record.uuid,
            name: record.person.full_name,
            text: record.text,
            avatar: AVATAR_BASE_URL + record.person.avatar,
            role: record.person.designation,
            company: record.person.company,
            featured: record.featured === 1,
        };
    }

    /**
     * Lists testimonial items newest first.
     *
     * @param fixture - Recommendation fixture to adapt.
     * @returns Testimonial items newest first.
     */
    public static testimonials(fixture: RecommendationsFixture): readonly TestimonialItem[] {
        return Recommendations.listNewestFirst(fixture).map(Recommendations.toTestimonial);
    }
}
