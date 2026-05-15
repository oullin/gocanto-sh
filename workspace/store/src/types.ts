export type FixtureEnvelope<TData> = {
    readonly version: string;
    readonly data: TData;
};

export type EducationRecord = {
    readonly uuid: string;
    readonly icon: string;
    readonly school: string;
    readonly degree: string;
    readonly field: string;
    readonly description: string;
    readonly graduated_at: string;
    readonly issuing_country: string;
};

export type ExperienceRecord = {
    readonly uuid: string;
    readonly company: string;
    readonly employment_type: string;
    readonly location_type: string;
    readonly position: string;
    readonly start_date: string;
    readonly end_date: string;
    readonly summary: string;
    readonly country: string;
    readonly city: string;
    readonly skills: string;
};

export type LinkRecord = {
    readonly uuid: string;
    readonly handle: string;
    readonly url: string;
    readonly description: string;
    readonly name: string;
};

export type ProfileSkillRecord = {
    readonly uuid: string;
    readonly percentage: number;
    readonly item: string;
    readonly description: string;
    readonly signature?: boolean;
    readonly long_description?: string;
    readonly related_tech?: readonly string[];
    readonly years?: number;
    readonly example_projects?: readonly (string | ProfileSkillExampleProject)[];
};

export type ProfileSkillExampleProject = {
    readonly title: string;
    readonly url?: string;
};

export type ProfileRecord = {
    readonly nickname: string;
    readonly handle: string;
    readonly name: string;
    readonly email: string;
    readonly profession: string;
    readonly skills: readonly ProfileSkillRecord[];
};

export type ProjectRecord = {
    readonly uuid: string;
    readonly language: string;
    readonly title: string;
    readonly excerpt: string;
    readonly url: string;
    readonly is_open_source: boolean;
    readonly icon: string;
    readonly published_at: string;
    readonly sort: number;
};

export type RecommendationPersonRecord = {
    readonly avatar: string;
    readonly full_name: string;
    readonly company: string;
    readonly designation: string;
};

export type RecommendationRecord = {
    readonly uuid: string;
    readonly relation: string;
    readonly text: string;
    readonly person: RecommendationPersonRecord;
    readonly created_at: string;
    readonly updated_at: string;
    readonly featured: number;
};

export type TalkRecord = {
    readonly uuid: string;
    readonly subject: string;
    readonly title: string;
    readonly url: string;
    readonly photo: string;
    readonly location: string;
    readonly created_at: string;
    readonly updated_at: string;
};

export type EducationFixture = FixtureEnvelope<readonly EducationRecord[]>;
export type ExperienceFixture = FixtureEnvelope<readonly ExperienceRecord[]>;
export type LinksFixture = FixtureEnvelope<readonly LinkRecord[]>;
export type ProfileFixture = FixtureEnvelope<ProfileRecord>;
export type ProjectsFixture = FixtureEnvelope<readonly ProjectRecord[]>;
export type RecommendationsFixture = FixtureEnvelope<readonly RecommendationRecord[]>;
export type TalksFixture = FixtureEnvelope<readonly TalkRecord[]>;
