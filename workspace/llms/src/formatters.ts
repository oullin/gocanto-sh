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
import { stripHtml } from "@gocanto/domain/text";

const SITE_URL = "https://gocanto.sh";

const escapeMarkdown = (input: string): string => input.replace(/\|/g, "\\|");

const renderSkill = (skill: ProfileSkillRecord): string => {
    const heading = skill.signature ? `### ${skill.item} ⭐ (signature)` : `### ${skill.item}`;
    const lines: string[] = [heading];

    lines.push(`- Proficiency: ${skill.percentage}%`);
    if (skill.years !== undefined) {
        lines.push(`- Years: ${skill.years}`);
    }

    lines.push("", stripHtml(skill.description));

    if (skill.long_description) {
        lines.push("", stripHtml(skill.long_description));
    }

    if (skill.related_tech?.length) {
        lines.push("", `**Related:** ${skill.related_tech.join(", ")}`);
    }

    if (skill.example_projects?.length) {
        lines.push("", "**Example projects:**");
        for (const project of skill.example_projects) {
            if (typeof project === "string") {
                lines.push(`- ${project}`);
            } else if (project.url) {
                lines.push(`- [${project.title}](${project.url})`);
            } else {
                lines.push(`- ${project.title}`);
            }
        }
    }

    return lines.join("\n");
};

export const formatProfile = (fixture: ProfileFixture): string => {
    const { name, profession, nickname, handle, email, skills } = fixture.data;
    const signature = skills.filter((s) => s.signature);
    const others = skills.filter((s) => !s.signature);

    const sections: string[] = [
        `# ${name}`,
        "",
        `> ${profession}`,
        "",
        "## At a glance",
        "",
        `- **Name:** ${name}`,
        `- **Nickname:** ${nickname}`,
        `- **Handle:** @${handle}`,
        `- **Email:** ${email}`,
        `- **Profession:** ${profession}`,
        `- **Site:** ${SITE_URL}/`,
        "",
        "## Signature skills",
        "",
    ];

    if (signature.length) {
        sections.push(signature.map(renderSkill).join("\n\n"));
    } else {
        sections.push("_None recorded._");
    }

    sections.push("", "## All skills", "");
    sections.push(others.map(renderSkill).join("\n\n"));

    return sections.join("\n");
};

const renderProject = (project: ProjectRecord): string => {
    const lines: string[] = [
        `### ${project.title}`,
        "",
        `- Language/Stack: ${project.language}`,
        `- Open source: ${project.is_open_source ? "yes" : "no"}`,
        `- Published: ${project.published_at}`,
        `- URL: <${project.url}>`,
        "",
        stripHtml(project.excerpt),
    ];

    return lines.join("\n");
};

export const formatProjects = (fixture: ProjectsFixture): string => {
    const sorted = [...fixture.data].sort((a, b) => a.sort - b.sort);

    return [
        "# Projects",
        "",
        `> ${sorted.length} projects across systems, AI agents, web, and open source.`,
        "",
        sorted.map(renderProject).join("\n\n---\n\n"),
    ].join("\n");
};

const renderExperience = (entry: ExperienceRecord): string => {
    const lines: string[] = [
        `### ${entry.position} — ${entry.company}`,
        "",
        `- Dates: ${entry.start_date} – ${entry.end_date}`,
        `- Employment: ${entry.employment_type} (${entry.location_type})`,
        `- Location: ${entry.city}, ${entry.country}`,
        "",
        stripHtml(entry.summary),
        "",
        `**Skills:** ${entry.skills}`,
    ];

    return lines.join("\n");
};

export const formatExperience = (fixture: ExperienceFixture): string =>
    [
        "# Experience",
        "",
        "> Reverse-chronological work history.",
        "",
        fixture.data.map(renderExperience).join("\n\n---\n\n"),
    ].join("\n");

const renderEducation = (entry: EducationRecord): string => {
    const lines: string[] = [
        `### ${entry.degree}, ${entry.field}`,
        "",
        `- School: ${entry.school}`,
        `- Graduated: ${entry.graduated_at}`,
        `- Country: ${entry.issuing_country}`,
        "",
        stripHtml(entry.description),
    ];

    return lines.join("\n");
};

export const formatEducation = (fixture: EducationFixture): string =>
    ["# Education", "", fixture.data.map(renderEducation).join("\n\n---\n\n")].join("\n");

const renderRecommendation = (rec: RecommendationRecord): string => {
    const body = stripHtml(rec.text)
        .split("\n")
        .map((line) => (line ? `> ${line}` : ">"))
        .join("\n");

    return [
        `### ${rec.person.full_name} — ${rec.person.designation} @ ${rec.person.company}`,
        "",
        `_${escapeMarkdown(rec.relation)}_`,
        "",
        body,
    ].join("\n");
};

export const formatRecommendations = (fixture: RecommendationsFixture): string =>
    [
        "# Recommendations",
        "",
        `> ${fixture.data.length} recommendations from colleagues, managers, and reports.`,
        "",
        fixture.data.map(renderRecommendation).join("\n\n---\n\n"),
    ].join("\n");

const renderTalk = (talk: TalkRecord): string =>
    [
        `### ${talk.title}`,
        "",
        `- Subject: ${talk.subject}`,
        `- Location: ${talk.location}`,
        `- Date: ${talk.created_at}`,
        `- URL: <${talk.url}>`,
    ].join("\n");

export const formatTalks = (fixture: TalksFixture): string =>
    ["# Talks", "", fixture.data.map(renderTalk).join("\n\n---\n\n")].join("\n");

const renderLink = (link: LinkRecord): string =>
    `- [${link.name} (${link.handle})](${link.url}) — ${stripHtml(link.description)}`;

export const formatLinks = (fixture: LinksFixture): string =>
    [
        "# Links",
        "",
        "> Social and professional profiles.",
        "",
        fixture.data.map(renderLink).join("\n"),
    ].join("\n");

export type AllFixtures = {
    profile: ProfileFixture;
    projects: ProjectsFixture;
    experience: ExperienceFixture;
    education: EducationFixture;
    recommendations: RecommendationsFixture;
    talks: TalksFixture;
    links: LinksFixture;
};

export const formatAll = (data: AllFixtures): string =>
    [
        formatProfile(data.profile),
        formatExperience(data.experience),
        formatProjects(data.projects),
        formatEducation(data.education),
        formatTalks(data.talks),
        formatRecommendations(data.recommendations),
        formatLinks(data.links),
    ].join("\n\n---\n\n");
