import type { ProfileFixture } from "@gocanto/store";

export const renderLlmsTxt = (
    siteUrl: string,
    profile: ProfileFixture,
): string => {
    const { name, profession } = profile.data;
    return `# ${name}

> ${profession} — full profile, projects, experience, talks, recommendations, and links. Static markdown bundles for LLM agents and direct human consumption.

## Profile

- [Full profile (combined)](${siteUrl}/index.md): Everything below in one file.

## Sections

- [Profile & skills](${siteUrl}/profile.md)
- [Experience](${siteUrl}/experience.md)
- [Projects](${siteUrl}/projects.md)
- [Education](${siteUrl}/education.md)
- [Talks](${siteUrl}/talks.md)
- [Recommendations](${siteUrl}/recommendations.md)
- [Links](${siteUrl}/links.md)
`;
};
