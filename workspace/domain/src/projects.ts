import type { ProjectRecord, ProjectsFixture } from "@gocanto/store";

import { firstSentenceExcerpt } from "./text";

export type ProjectTag = {
    readonly label: string;
    readonly color: "blue" | "green";
};

export type ProjectRow = {
    readonly record: ProjectRecord;
    readonly title: string;
    readonly url: string;
    readonly language: string;
    readonly excerpt: string;
    readonly tags: readonly ProjectTag[];
};

const EXCERPT_MAX = 140;

export const toProjectRow = (project: ProjectRecord): ProjectRow => ({
    record: project,
    title: project.title,
    url: project.url,
    language: project.language,
    excerpt: firstSentenceExcerpt(project.excerpt, EXCERPT_MAX),
    tags: [
        { label: project.language, color: "blue" },
        ...(project.is_open_source ? [{ label: "Open Source", color: "green" } as const] : []),
    ],
});

export const listProjectRows = (fixture: ProjectsFixture): readonly ProjectRow[] =>
    [...fixture.data].sort((a, b) => a.sort - b.sort).map(toProjectRow);

export const listProjectLanguages = (rows: readonly ProjectRow[]): readonly string[] =>
    [...new Set(rows.map((row) => row.language))].sort();

export const filterProjectRows = (
    rows: readonly ProjectRow[],
    languages: ReadonlySet<string>,
): readonly ProjectRow[] =>
    languages.size === 0 ? rows : rows.filter((row) => languages.has(row.language));
