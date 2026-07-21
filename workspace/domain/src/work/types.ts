import type { ExperienceRecord } from "@gocanto/store";

/** Supported work tag colors. */
export type WorkTagColor = "amber" | "blue" | "green" | "purple";

/** Display tag attached to a work card. */
export type WorkTag = {
    readonly label: string;
    readonly color: WorkTagColor;
};

/** Experience record adapted for featured work display. */
export type WorkCard = {
    readonly record: ExperienceRecord;
    readonly title: string;
    readonly excerpt: string;
    readonly tags: readonly WorkTag[];
};
