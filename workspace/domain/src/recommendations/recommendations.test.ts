import { describe, expect, it } from "vitest";

import { Recommendations } from "#domain/recommendations/recommendations";

const recommendationFixture = {
    version: "1.0.0",
    data: [
        {
            uuid: "old",
            relation: "Manager",
            text: "<p>Great work.</p>",
            person: {
                avatar: "old.jpg",
                full_name: "Old Person",
                company: "Old Co",
                designation: "CTO",
            },
            created_at: "2022-01-01",
            updated_at: "2022-01-01",
            featured: 0,
        },
        {
            uuid: "new",
            relation: "Peer",
            text: "Excellent.",
            person: {
                avatar: "new.jpg",
                full_name: "New Person",
                company: "New Co",
                designation: "Lead",
            },
            created_at: "2024-01-01",
            updated_at: "2024-01-01",
            featured: 1,
        },
    ],
} as const;

describe("recommendation domain", () => {
    it("dedupes, sorts, and maps testimonials", () => {
        expect(
        	Recommendations.unique([recommendationFixture.data[0], recommendationFixture.data[0]]),
        ).toHaveLength(1);
        expect(Recommendations.listNewestFirst(recommendationFixture)[0]?.uuid).toBe("new");
        expect(Recommendations.testimonials(recommendationFixture)[0]?.avatar).toBe(
            "https://oullin.io/images/new.jpg",
        );
    });
});
