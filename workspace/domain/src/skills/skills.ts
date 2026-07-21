import type { ProfileFixture, ProfileSkillRecord } from "@gocanto/store";

import type { SkillCell } from "#domain/skills/types";

/** Provides pure transformations for profile skills. */
export class Skills {
    private static readonly CHIP_VARIANTS = ["green", "blue", "purple", "amber"] as const;

    private constructor() {}

    /**
     * Resolves the icon key configured for a skill.
     *
     * @param skillName - Skill name to resolve.
     * @returns The icon key, or null when the skill has no configured icon.
     */
    public static iconKey(skillName: string): string | null {
        const keys: Record<string, string> = {
            Leadership: "users",
            "System Design": "layers",
            "E-commerce Architecture": "shopping-cart",
            "Go (Programming Language)": "binary",
            "AI (Artificial Intelligence)": "brain",
            "AS/400 Modernisation": "server",
            "Agentic Orchestration": "workflow",
            "Payment Integration": "credit-card",
            "Kafka Event Pipelines": "waypoints",
        };

        return keys[skillName] ?? null;
    }

    /**
     * Derives up to two initials from a skill title.
     *
     * @param title - Skill title to abbreviate.
     * @returns Uppercase skill initials.
     */
    public static initials(title: string): string {
        const words = title
            .replace(/[()/.,]/g, " ")
            .trim()
            .split(/\s+/);

        if (words.length === 1) {
            return (words[0] ?? "").slice(0, 2).toUpperCase();
        }

        return `${words[0]?.[0] ?? ""}${words[1]?.[0] ?? ""}`.toUpperCase();
    }

    /**
     * Selects a stable chip color variant from a skill name.
     *
     * @param name - Skill name to hash.
     * @returns A stable chip color variant.
     */
    public static chipVariant(name: string): (typeof Skills.CHIP_VARIANTS)[number] {
        let hash = 0;

        for (let i = 0; i < name.length; i++) {
            hash = (hash * 31 + name.charCodeAt(i)) | 0;
        }

        return Skills.CHIP_VARIANTS[Math.abs(hash) % Skills.CHIP_VARIANTS.length];
    }

    /**
     * Adapts a profile skill into a display cell.
     *
     * @param skill - Profile skill to adapt.
     * @returns A skill display cell.
     */
    public static toCell(skill: ProfileSkillRecord): SkillCell {
        return {
            skill,
            title: skill.item,
            description: skill.description,
            iconKey: Skills.iconKey(skill.item),
            initials: Skills.initials(skill.item),
        };
    }

    /**
     * Lists signature skill display cells.
     *
     * @param fixture - Profile fixture to inspect.
     * @returns Signature skill cells.
     */
    public static signatureCells(fixture: ProfileFixture): readonly SkillCell[] {
        return fixture.data.skills.filter((skill) => skill.signature === true).map(Skills.toCell);
    }

    /**
     * Lists supporting skill display cells.
     *
     * @param fixture - Profile fixture to inspect.
     * @returns Supporting skill cells.
     */
    public static supportingCells(fixture: ProfileFixture): readonly SkillCell[] {
        return fixture.data.skills.filter((skill) => skill.signature !== true).map(Skills.toCell);
    }
}
