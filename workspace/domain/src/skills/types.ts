import type { ProfileSkillRecord } from "@gocanto/store";

/** Profile skill adapted for display in a skill grid. */
export type SkillCell = {
    readonly skill: ProfileSkillRecord;
    readonly title: string;
    readonly description: string;
    readonly iconKey: string | null;
    readonly initials: string;
};
