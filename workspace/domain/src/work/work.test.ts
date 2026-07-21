import { describe, expect, it } from "vitest";

import { Work } from "#domain/work/work";

describe("work domain", () => {
    it("builds featured work cards from records", () => {
        const cards = Work.listFeaturedCards(
            {
                version: "1.0.0",
                data: [
                    {
                        uuid: "work",
                        company: "Acme",
                        employment_type: "Full-Time",
                        location_type: "Remote",
                        position: "Engineer",
                        start_date: "2020",
                        end_date: "2024",
                        summary: "<p>Built systems.</p>",
                        country: "US",
                        city: "New York",
                        skills: "Go, TypeScript",
                    },
                ],
            },
            1,
        );

        expect(cards[0]?.title).toBe("Engineer · Acme");
        expect(cards[0]?.tags[0]).toEqual({ label: "Full-Time", color: "blue" });
    });
});
