import type { ProjectRecord } from "@gocanto/store";

/** Display tag attached to a project row. */
export type ProjectTag = {
    readonly label: string;
    readonly color: "blue" | "green";
};

/** Project record adapted for the projects table. */
export type ProjectRow = {
    readonly record: ProjectRecord;
    readonly title: string;
    readonly url: string;
    readonly language: string;
    readonly excerpt: string;
    readonly tags: readonly ProjectTag[];
};
