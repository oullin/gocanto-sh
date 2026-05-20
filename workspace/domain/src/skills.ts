import type { ProfileFixture, ProfileSkillRecord } from "@gocanto/store";

export type SkillCell = {
    readonly skill: ProfileSkillRecord;
    readonly title: string;
    readonly description: string;
    readonly iconKey: string | null;
    readonly initials: string;
};

export const iconKeyForSkill = (skillName: string): string | null => {
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
};

export const skillInitials = (title: string): string => {
    const words = title
        .replace(/[()/.,]/g, " ")
        .trim()
        .split(/\s+/);

    if (words.length === 1) {
        return (words[0] ?? "").slice(0, 2).toUpperCase();
    }

    return `${words[0]?.[0] ?? ""}${words[1]?.[0] ?? ""}`.toUpperCase();
};

const CHIP_VARIANTS = ["green", "blue", "purple", "amber"] as const;

export const skillChipVariant = (name: string): (typeof CHIP_VARIANTS)[number] => {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) | 0;
    }

    return CHIP_VARIANTS[Math.abs(hash) % CHIP_VARIANTS.length];
};

export const toSkillCell = (skill: ProfileSkillRecord): SkillCell => ({
    skill,
    title: skill.item,
    description: skill.description,
    iconKey: iconKeyForSkill(skill.item),
    initials: skillInitials(skill.item),
});

export const listSignatureSkillCells = (fixture: ProfileFixture): readonly SkillCell[] =>
    fixture.data.skills.filter((skill) => skill.signature === true).map(toSkillCell);

export const listSupportingSkillCells = (fixture: ProfileFixture): readonly SkillCell[] =>
    fixture.data.skills.filter((skill) => skill.signature !== true).map(toSkillCell);
