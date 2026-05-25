import type { ExperienceRecord, ExperienceFixture } from "@gocanto/store";

import { compactWhitespace, stripHtml } from "#domain/text";

export type WorkTagColor = "amber" | "blue" | "green" | "purple";

export type WorkTag = {
    readonly label: string;
    readonly color: WorkTagColor;
};

export type WorkCard = {
    readonly record: ExperienceRecord;
    readonly title: string;
    readonly excerpt: string;
    readonly tags: readonly WorkTag[];
};

export const workTagColorFor = (label: string): WorkTagColor => {
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
};

export const toWorkCard = (entry: ExperienceRecord): WorkCard => ({
    record: entry,
    title: `${entry.position} · ${entry.company}`,
    excerpt: compactWhitespace(stripHtml(entry.summary)).slice(0, 180).trim(),
    tags: [
        { label: entry.employment_type, color: workTagColorFor(entry.employment_type) },
        { label: entry.country, color: "green" },
    ],
});

export const listFeaturedWorkCards = (
    fixture: ExperienceFixture,
    count: number,
): readonly WorkCard[] => fixture.data.slice(0, count).map(toWorkCard);
