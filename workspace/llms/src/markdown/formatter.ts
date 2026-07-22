import { TextFormatter } from "@gocanto/domain/text";
import { SITE_URL } from "#llms/kernel/constants";
import type { AllFixtures } from "#llms/markdown/types";

import type {
    BioFixture,
    EducationFixture,
    EducationRecord,
    ExperienceFixture,
    ExperienceRecord,
    LinkRecord,
    LinksFixture,
    ProfileFixture,
    ProfileSkillExampleProject,
    ProfileSkillRecord,
    ProjectRecord,
    ProjectsFixture,
    RecommendationRecord,
    RecommendationsFixture,
    TalkRecord,
    TalksFixture,
} from "@gocanto/store";

/** Renders fixture data as byte-compatible markdown resources. */
export class FixtureMarkdown {
    private constructor() {}

    /**
     * Renders the profile and skills fixture.
     *
     * @param fixture - Profile fixture to render.
     * @returns Profile markdown.
     */
    public static profile(fixture: ProfileFixture): string {
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
            sections.push(signature.map(FixtureMarkdown.renderSkill).join("\n\n"));
        } else {
            sections.push("_None recorded._");
        }

        sections.push("", "## All skills", "");
        sections.push(others.map(FixtureMarkdown.renderSkill).join("\n\n"));

        return sections.join("\n");
    }

    /**
     * Renders the projects fixture.
     *
     * @param fixture - Projects fixture to render.
     * @returns Projects markdown.
     */
    public static projects(fixture: ProjectsFixture): string {
        const sorted = [...fixture.data].sort((a, b) => a.sort - b.sort);

        return [
            "# Projects",
            "",
            `> ${sorted.length} projects across systems, AI agents, web, and open source.`,
            "",
            sorted.map(FixtureMarkdown.renderProject).join("\n\n---\n\n"),
        ].join("\n");
    }

    /**
     * Renders the experience fixture.
     *
     * @param fixture - Experience fixture to render.
     * @returns Experience markdown.
     */
    public static experience(fixture: ExperienceFixture): string {
        return [
            "# Experience",
            "",
            "> Reverse-chronological work history.",
            "",
            fixture.data.map(FixtureMarkdown.renderExperience).join("\n\n---\n\n"),
        ].join("\n");
    }

    /**
     * Renders the education fixture.
     *
     * @param fixture - Education fixture to render.
     * @returns Education markdown.
     */
    public static education(fixture: EducationFixture): string {
        return [
            "# Education",
            "",
            fixture.data.map(FixtureMarkdown.renderEducation).join("\n\n---\n\n"),
        ].join("\n");
    }

    /**
     * Renders the recommendations fixture.
     *
     * @param fixture - Recommendations fixture to render.
     * @returns Recommendations markdown.
     */
    public static recommendations(fixture: RecommendationsFixture): string {
        return [
            "# Recommendations",
            "",
            `> ${fixture.data.length} recommendations from colleagues, managers, and reports.`,
            "",
            fixture.data.map(FixtureMarkdown.renderRecommendation).join("\n\n---\n\n"),
        ].join("\n");
    }

    /**
     * Renders the talks fixture.
     *
     * @param fixture - Talks fixture to render.
     * @returns Talks markdown.
     */
    public static talks(fixture: TalksFixture): string {
        return [
            "# Talks",
            "",
            fixture.data.map(FixtureMarkdown.renderTalk).join("\n\n---\n\n"),
        ].join("\n");
    }

    /**
     * Renders the links fixture.
     *
     * @param fixture - Links fixture to render.
     * @returns Links markdown.
     */
    public static links(fixture: LinksFixture): string {
        return [
            "# Links",
            "",
            "> Social and professional profiles.",
            "",
            fixture.data.map(FixtureMarkdown.renderLink).join("\n"),
        ].join("\n");
    }

    /**
     * Renders all fixture sections into one combined markdown document.
     *
     * @param data - Complete fixture collection to render.
     * @returns Combined markdown.
     */
    /**
     * Renders the biography fixture.
     *
     * @param fixture - Biography fixture to render.
     * @returns Biography markdown.
     */
    public static bio(fixture: BioFixture): string {
        const { tagline, note, paragraphs, quick_facts } = fixture.data;

        return [
            "# Bio",
            "",
            `> ${tagline}`,
            "",
            note,
            "",
            "## Story",
            "",
            paragraphs.map((paragraph) => TextFormatter.stripHtml(paragraph)).join("\n\n"),
            "",
            "## Quick facts",
            "",
            quick_facts.map(({ key, value }) => `- **${key}:** ${value}`).join("\n"),
        ].join("\n");
    }

    public static all(data: AllFixtures): string {
        return [
            FixtureMarkdown.profile(data.profile),
            FixtureMarkdown.bio(data.bio),
            FixtureMarkdown.experience(data.experience),
            FixtureMarkdown.projects(data.projects),
            FixtureMarkdown.education(data.education),
            FixtureMarkdown.talks(data.talks),
            FixtureMarkdown.recommendations(data.recommendations),
            FixtureMarkdown.links(data.links),
        ].join("\n\n---\n\n");
    }

    private static escapeMarkdown(input: string): string {
        return input.replace(/\|/g, "\\|");
    }

    private static renderSkill(skill: ProfileSkillRecord): string {
        const heading = skill.signature ? `### ${skill.item} ⭐ (signature)` : `### ${skill.item}`;
        const lines: string[] = [heading];

        lines.push(`- Proficiency: ${skill.percentage}%`);
        if (skill.years !== undefined) {
            lines.push(`- Years: ${skill.years}`);
        }

        lines.push("", TextFormatter.stripHtml(skill.description));

        if (skill.long_description) {
            lines.push("", TextFormatter.stripHtml(skill.long_description));
        }

        if (skill.related_tech?.length) {
            lines.push("", `**Related:** ${skill.related_tech.join(", ")}`);
        }

        if (skill.example_projects?.length) {
            lines.push(
                "",
                "**Example projects:**",
                ...skill.example_projects.map(FixtureMarkdown.renderSkillExampleProject),
            );
        }

        return lines.join("\n");
    }

    private static renderSkillExampleProject(project: string | ProfileSkillExampleProject): string {
        if (typeof project === "string") {
            return `- ${project}`;
        }

        if (project.url) {
            return `- [${project.title}](${project.url})`;
        }

        return `- ${project.title}`;
    }

    private static renderProject(project: ProjectRecord): string {
        const lines: string[] = [
            `### ${project.title}`,
            "",
            `- Language/Stack: ${project.language}`,
            `- Open source: ${project.is_open_source ? "yes" : "no"}`,
            `- Published: ${project.published_at}`,
            `- URL: <${project.url}>`,
            "",
            TextFormatter.stripHtml(project.excerpt),
        ];

        return lines.join("\n");
    }

    private static renderExperience(entry: ExperienceRecord): string {
        const lines: string[] = [
            `### ${entry.position} — ${entry.company}`,
            "",
            `- Dates: ${entry.start_date} – ${entry.end_date}`,
            `- Employment: ${entry.employment_type} (${entry.location_type})`,
            `- Location: ${entry.city}, ${entry.country}`,
            "",
            TextFormatter.stripHtml(entry.summary),
            "",
            `**Skills:** ${entry.skills}`,
        ];

        return lines.join("\n");
    }

    private static renderEducation(entry: EducationRecord): string {
        const lines: string[] = [
            `### ${entry.degree}, ${entry.field}`,
            "",
            `- School: ${entry.school}`,
            `- Graduated: ${entry.graduated_at}`,
            `- Country: ${entry.issuing_country}`,
            "",
            TextFormatter.stripHtml(entry.description),
        ];

        return lines.join("\n");
    }

    private static renderRecommendation(rec: RecommendationRecord): string {
        const body = TextFormatter.stripHtml(rec.text)
            .split("\n")
            .map((line) => (line ? `> ${line}` : ">"))
            .join("\n");

        return [
            `### ${rec.person.full_name} — ${rec.person.designation} @ ${rec.person.company}`,
            "",
            `_${FixtureMarkdown.escapeMarkdown(rec.relation)}_`,
            "",
            body,
        ].join("\n");
    }

    private static renderTalk(talk: TalkRecord): string {
        return [
            `### ${talk.title}`,
            "",
            `- Subject: ${talk.subject}`,
            `- Location: ${talk.location}`,
            `- Date: ${talk.created_at}`,
            `- URL: <${talk.url}>`,
        ].join("\n");
    }

    private static renderLink(link: LinkRecord): string {
        return `- [${link.name} (${link.handle})](${link.url}) — ${TextFormatter.stripHtml(link.description)}`;
    }
}
