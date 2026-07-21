import { TextFormatter } from "@gocanto/domain/text";
import type { ProjectRecord, ProjectsFixture } from "@gocanto/store";

import type { ProjectRow } from "#domain/projects/types";

/** Provides pure transformations for project records. */
export class Projects {
    private static readonly EXCERPT_MAX = 140;

    private constructor() {}

    /**
     * Adapts a project record into a table row.
     *
     * @param project - Project record to adapt.
     * @returns A project table row.
     */
    public static toRow(project: ProjectRecord): ProjectRow {
        return {
            record: project,
            title: project.title,
            url: project.url,
            language: project.language,
            excerpt: TextFormatter.firstSentence(project.excerpt, Projects.EXCERPT_MAX),
            tags: [
                { label: project.language, color: "blue" },
                ...(project.is_open_source
                    ? [{ label: "Open Source", color: "green" } as const]
                    : []),
            ],
        };
    }

    /**
     * Lists project rows in configured sort order.
     *
     * @param fixture - Project fixture to adapt.
     * @returns Sorted project rows.
     */
    public static rows(fixture: ProjectsFixture): readonly ProjectRow[] {
        return [...fixture.data].sort((a, b) => a.sort - b.sort).map(Projects.toRow);
    }

    /**
     * Lists unique project languages alphabetically.
     *
     * @param rows - Project rows to inspect.
     * @returns Sorted unique language names.
     */
    public static languages(rows: readonly ProjectRow[]): readonly string[] {
        return [...new Set(rows.map((row) => row.language))].sort();
    }

    /**
     * Filters project rows to selected languages.
     *
     * @param rows - Project rows to filter.
     * @param languages - Selected language names.
     * @returns Matching rows, or all rows when no language is selected.
     */
    public static filter(
        rows: readonly ProjectRow[],
        languages: ReadonlySet<string>,
    ): readonly ProjectRow[] {
        return languages.size === 0 ? rows : rows.filter((row) => languages.has(row.language));
    }
}
