import type { ProfileFixture } from "@gocanto/store";

/** Renders the discovery document for LLM-oriented site resources. */
export class LlmsTxt {
    private constructor() {}

    /**
     * Renders the llms.txt discovery document.
     *
     * @param siteUrl - Canonical site URL without a trailing slash.
     * @param profile - Profile fixture providing the site identity.
     * @returns Complete llms.txt contents.
     */
    public static render(siteUrl: string, profile: ProfileFixture): string {
        const { name, profession } = profile.data;

        return `# ${name}

> ${profession} — full profile, projects, experience, talks, recommendations, and links. Static markdown bundles for LLM agents and direct human consumption.

## Profile

- [Full profile (combined)](${siteUrl}/index.md): Everything below in one file.

## Sections

- [Profile & skills](${siteUrl}/profile.md)
- [Bio](${siteUrl}/bio.md)
- [Experience](${siteUrl}/experience.md)
- [Projects](${siteUrl}/projects.md)
- [Education](${siteUrl}/education.md)
- [Talks](${siteUrl}/talks.md)
- [Recommendations](${siteUrl}/recommendations.md)
- [Links](${siteUrl}/links.md)

## Writing

- [Engineering writing](https://writing.gocanto.sh/llms.txt): First-hand field notes and raw Markdown articles.
`;
    }
}
