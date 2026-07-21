import type {
    EducationFixture,
    ExperienceFixture,
    LinksFixture,
    ProfileFixture,
    ProjectsFixture,
    RecommendationsFixture,
    TalksFixture,
} from "@gocanto/store";

/** Groups every fixture required to render the complete markdown bundle. */
export type AllFixtures = {
    profile: ProfileFixture;
    projects: ProjectsFixture;
    experience: ExperienceFixture;
    education: EducationFixture;
    recommendations: RecommendationsFixture;
    talks: TalksFixture;
    links: LinksFixture;
};
