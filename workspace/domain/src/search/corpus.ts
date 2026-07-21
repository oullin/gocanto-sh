import { TextFormatter } from "@gocanto/domain/text";

import type { SearchFixtures, SearchKind, SearchResult } from "#domain/search/types";

/** Immutable searchable view of the portfolio fixtures. */
export class SearchCorpus {
    /** Ordered search categories and their display labels. */
    public static readonly KINDS: readonly {
        readonly key: SearchKind;
        readonly label: string;
    }[] = [
        { key: "work", label: "Work" },
        { key: "projects", label: "Projects" },
        { key: "skills", label: "Skills" },
        { key: "education", label: "Education" },
        { key: "talks", label: "Talks" },
        { key: "recommendations", label: "Recommendations" },
        { key: "links", label: "Links" },
    ];

    /** Work search results. */
    public readonly work: readonly SearchResult[];

    /** Project search results. */
    public readonly projects: readonly SearchResult[];

    /** Skill search results. */
    public readonly skills: readonly SearchResult[];

    /** Education search results. */
    public readonly education: readonly SearchResult[];

    /** Talk search results. */
    public readonly talks: readonly SearchResult[];

    /** Recommendation search results. */
    public readonly recommendations: readonly SearchResult[];

    /** Link search results. */
    public readonly links: readonly SearchResult[];

    private constructor(
        work: readonly SearchResult[],
        projects: readonly SearchResult[],
        skills: readonly SearchResult[],
        education: readonly SearchResult[],
        talks: readonly SearchResult[],
        recommendations: readonly SearchResult[],
        links: readonly SearchResult[],
    ) {
        this.work = work;
        this.projects = projects;
        this.skills = skills;
        this.education = education;
        this.talks = talks;
        this.recommendations = recommendations;
        this.links = links;
    }

    /**
     * Builds an immutable search corpus from store fixtures.
     *
     * @param fixtures - Source fixtures for every searchable concern.
     * @returns A populated search corpus.
     */
    public static from(fixtures: SearchFixtures): SearchCorpus {
        return new SearchCorpus(
            fixtures.experience.data.map(
                (entry): SearchResult => ({
                    key: `exp:${entry.uuid}`,
                    title: `${entry.position} · ${entry.company}`,
                    searchText: TextFormatter.searchable(
                        entry.position,
                        entry.company,
                        entry.country,
                        entry.city,
                        entry.skills,
                        entry.summary,
                        entry.start_date,
                        entry.end_date,
                    ),
                    payload: { kind: "Work", data: entry },
                }),
            ),
            fixtures.projects.data.map(
                (project): SearchResult => ({
                    key: `project:${project.uuid}`,
                    title: project.title,
                    searchText: TextFormatter.searchable(
                        project.title,
                        project.language,
                        project.excerpt,
                        project.is_open_source ? "open source" : "",
                    ),
                    payload: { kind: "Project", data: project },
                }),
            ),
            fixtures.profile.data.skills.map(
                (skill): SearchResult => ({
                    key: `skill:${skill.uuid}`,
                    title: skill.item,
                    searchText: TextFormatter.searchable(skill.item, skill.description),
                    payload: { kind: "Skill", data: skill },
                }),
            ),
            fixtures.education.data.map(
                (entry): SearchResult => ({
                    key: `edu:${entry.uuid}`,
                    title: `${entry.degree} · ${entry.field}`,
                    searchText: TextFormatter.searchable(
                        entry.degree,
                        entry.field,
                        entry.school,
                        entry.issuing_country,
                        entry.graduated_at,
                        entry.description,
                    ),
                    payload: { kind: "Education", data: entry },
                }),
            ),
            fixtures.talks.data.map(
                (talk): SearchResult => ({
                    key: `talk:${talk.uuid}`,
                    title: talk.title,
                    searchText: TextFormatter.searchable(talk.title, talk.subject, talk.location),
                    payload: { kind: "Talk", data: talk },
                }),
            ),
            fixtures.recommendations.data.map(
                (recommendation): SearchResult => ({
                    key: `rec:${recommendation.uuid}`,
                    title: `${recommendation.person.full_name} · ${recommendation.person.company}`,
                    searchText: TextFormatter.searchable(
                        recommendation.person.full_name,
                        recommendation.person.company,
                        recommendation.person.designation,
                        recommendation.relation,
                        recommendation.text,
                    ),
                    payload: { kind: "Recommendation", data: recommendation },
                }),
            ),
            fixtures.links.data.map(
                (link): SearchResult => ({
                    key: `link:${link.uuid}`,
                    title: `${link.name} · ${link.handle}`,
                    searchText: TextFormatter.searchable(
                        link.name,
                        link.handle,
                        link.url,
                        link.description,
                    ),
                    payload: { kind: "Link", data: link },
                }),
            ),
        );
    }
}
