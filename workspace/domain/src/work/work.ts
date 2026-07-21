import { TextFormatter } from "@gocanto/domain/text";
import type { ExperienceFixture, ExperienceRecord } from "@gocanto/store";

import type { WorkCard, WorkTagColor } from "#domain/work/types";

/** Provides pure transformations for work experience records. */
export class Work {
    private constructor() {}

    /**
     * Selects a display color for a work tag.
     *
     * @param label - Work tag label.
     * @returns The matching display color.
     */
    public static tagColor(label: string): WorkTagColor {
        if (label === "Contract") {
            return "purple";
        }

        if (label === "Contractor") {
            return "amber";
        }

        if (label === "Full-Time") {
            return "blue";
        }

        return "green";
    }

    /**
     * Adapts an experience record into a work card.
     *
     * @param entry - Experience record to adapt.
     * @returns A work card.
     */
    public static toCard(entry: ExperienceRecord): WorkCard {
        return {
            record: entry,
            title: `${entry.position} · ${entry.company}`,
            excerpt: TextFormatter.compactWhitespace(TextFormatter.stripHtml(entry.summary))
                .slice(0, 180)
                .trim(),
            tags: [
                { label: entry.employment_type, color: Work.tagColor(entry.employment_type) },
                { label: entry.country, color: "green" },
            ],
        };
    }

    /**
     * Lists the requested number of featured work cards.
     *
     * @param fixture - Experience fixture to adapt.
     * @param count - Maximum number of cards to return.
     * @returns Featured work cards.
     */
    public static listFeaturedCards(
        fixture: ExperienceFixture,
        count: number,
    ): readonly WorkCard[] {
        return fixture.data.slice(0, count).map(Work.toCard);
    }
}
