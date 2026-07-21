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

/** Payload carried by a search result. */
export type SearchPayload =
    | { readonly kind: "Work"; readonly data: ExperienceRecord }
    | { readonly kind: "Project"; readonly data: ProjectRecord }
    | { readonly kind: "Skill"; readonly data: ProfileSkillRecord }
    | { readonly kind: "Education"; readonly data: EducationRecord }
    | { readonly kind: "Talk"; readonly data: TalkRecord }
    | { readonly kind: "Recommendation"; readonly data: RecommendationRecord }
    | { readonly kind: "Link"; readonly data: LinkRecord };

/** Searchable result and its domain payload. */
export type SearchResult = {
    readonly key: string;
    readonly title: string;
    readonly searchText: string;
    readonly payload: SearchPayload;
};

/** Named result collections available in the search corpus. */
export type SearchKind =
    | "work"
    | "projects"
    | "skills"
    | "education"
    | "talks"
    | "recommendations"
    | "links";

/** Fixture collection required to build a search corpus. */
export type SearchFixtures = {
    readonly education: EducationFixture;
    readonly experience: ExperienceFixture;
    readonly links: LinksFixture;
    readonly profile: ProfileFixture;
    readonly projects: ProjectsFixture;
    readonly recommendations: RecommendationsFixture;
    readonly talks: TalksFixture;
};
