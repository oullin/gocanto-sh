import type {
    EducationFixture,
    EducationRecord,
    ExperienceFixture,
    ExperienceRecord,
    LinkRecord,
    LinksFixture,
    ProfileFixture,
    ProfileSkillRecord,
    ProjectRecord,
    ProjectsFixture,
    RecommendationRecord,
    RecommendationsFixture,
    TalkRecord,
    TalksFixture,
} from "@gocanto/store";

import { searchableText } from "#domain/text";

export type SearchPayload =
    | { readonly kind: "Work"; readonly data: ExperienceRecord }
    | { readonly kind: "Project"; readonly data: ProjectRecord }
    | { readonly kind: "Skill"; readonly data: ProfileSkillRecord }
    | { readonly kind: "Education"; readonly data: EducationRecord }
    | { readonly kind: "Talk"; readonly data: TalkRecord }
    | { readonly kind: "Recommendation"; readonly data: RecommendationRecord }
    | { readonly kind: "Link"; readonly data: LinkRecord };

export type SearchResult = {
    readonly key: string;
    readonly title: string;
    readonly searchText: string;
    readonly payload: SearchPayload;
};

export type SearchCorpus = {
    readonly work: readonly SearchResult[];
    readonly projects: readonly SearchResult[];
    readonly skills: readonly SearchResult[];
    readonly education: readonly SearchResult[];
    readonly talks: readonly SearchResult[];
    readonly recommendations: readonly SearchResult[];
    readonly links: readonly SearchResult[];
};

export type SearchKind = keyof SearchCorpus;

export const SEARCH_KINDS: readonly { readonly key: SearchKind; readonly label: string }[] = [
    { key: "work", label: "Work" },
    { key: "projects", label: "Projects" },
    { key: "skills", label: "Skills" },
    { key: "education", label: "Education" },
    { key: "talks", label: "Talks" },
    { key: "recommendations", label: "Recommendations" },
    { key: "links", label: "Links" },
];

export type SearchFixtures = {
    readonly education: EducationFixture;
    readonly experience: ExperienceFixture;
    readonly links: LinksFixture;
    readonly profile: ProfileFixture;
    readonly projects: ProjectsFixture;
    readonly recommendations: RecommendationsFixture;
    readonly talks: TalksFixture;
};

export const buildSearchCorpus = (fixtures: SearchFixtures): SearchCorpus => ({
    work: fixtures.experience.data.map((entry) => ({
        key: `exp:${entry.uuid}`,
        title: `${entry.position} · ${entry.company}`,
        searchText: searchableText(
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
    })),
    projects: fixtures.projects.data.map((project) => ({
        key: `project:${project.uuid}`,
        title: project.title,
        searchText: searchableText(
            project.title,
            project.language,
            project.excerpt,
            project.is_open_source ? "open source" : "",
        ),
        payload: { kind: "Project", data: project },
    })),
    skills: fixtures.profile.data.skills.map((skill) => ({
        key: `skill:${skill.uuid}`,
        title: skill.item,
        searchText: searchableText(skill.item, skill.description),
        payload: { kind: "Skill", data: skill },
    })),
    education: fixtures.education.data.map((entry) => ({
        key: `edu:${entry.uuid}`,
        title: `${entry.degree} · ${entry.field}`,
        searchText: searchableText(
            entry.degree,
            entry.field,
            entry.school,
            entry.issuing_country,
            entry.graduated_at,
            entry.description,
        ),
        payload: { kind: "Education", data: entry },
    })),
    talks: fixtures.talks.data.map((talk) => ({
        key: `talk:${talk.uuid}`,
        title: talk.title,
        searchText: searchableText(talk.title, talk.subject, talk.location),
        payload: { kind: "Talk", data: talk },
    })),
    recommendations: fixtures.recommendations.data.map((recommendation) => ({
        key: `rec:${recommendation.uuid}`,
        title: `${recommendation.person.full_name} · ${recommendation.person.company}`,
        searchText: searchableText(
            recommendation.person.full_name,
            recommendation.person.company,
            recommendation.person.designation,
            recommendation.relation,
            recommendation.text,
        ),
        payload: { kind: "Recommendation", data: recommendation },
    })),
    links: fixtures.links.data.map((link) => ({
        key: `link:${link.uuid}`,
        title: `${link.name} · ${link.handle}`,
        searchText: searchableText(link.name, link.handle, link.url, link.description),
        payload: { kind: "Link", data: link },
    })),
});
