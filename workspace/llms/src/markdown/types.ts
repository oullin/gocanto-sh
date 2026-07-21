import type {
    BioFixture,
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
    bio: BioFixture;
    projects: ProjectsFixture;
    experience: ExperienceFixture;
    education: EducationFixture;
    recommendations: RecommendationsFixture;
    talks: TalksFixture;
    links: LinksFixture;
};
