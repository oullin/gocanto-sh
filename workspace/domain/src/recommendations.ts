import type { RecommendationRecord, RecommendationsFixture } from "@gocanto/store";

export const AVATAR_BASE_URL = "https://oullin.io/images/";

export type TestimonialItem = {
    readonly id: string;
    readonly name: string;
    readonly text: string;
    readonly avatar: string;
    readonly role: string;
    readonly company: string;
    readonly featured: boolean;
};

export const uniqueRecommendations = (
    items: readonly RecommendationRecord[],
): readonly RecommendationRecord[] => {
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
};

export const sortRecommendationsNewestFirst = (
    items: readonly RecommendationRecord[],
): readonly RecommendationRecord[] =>
    [...items].sort((a, b) => b.created_at.localeCompare(a.created_at));

export const listRecommendationsNewestFirst = (
    fixture: RecommendationsFixture,
): readonly RecommendationRecord[] => sortRecommendationsNewestFirst(fixture.data);

export const toTestimonialItem = (record: RecommendationRecord): TestimonialItem => ({
    id: record.uuid,
    name: record.person.full_name,
    text: record.text,
    avatar: AVATAR_BASE_URL + record.person.avatar,
    role: record.person.designation,
    company: record.person.company,
    featured: record.featured === 1,
});

export const listTestimonials = (fixture: RecommendationsFixture): readonly TestimonialItem[] =>
    listRecommendationsNewestFirst(fixture).map(toTestimonialItem);
