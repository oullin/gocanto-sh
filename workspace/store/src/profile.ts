import { profileSkills } from "#store/profile/skills";

import type { ProfileFixture } from "#store/types";

export const profile = {
    version: "1.0.3",
    data: {
        nickname: "gus",
        handle: "gocanto",
        name: "Gustavo Ocanto",
        email: "hi@ollin.sh",
        profession: "Software Architect for Regulated Systems",
        updated_at: "2026-07-22",
        skills: profileSkills,
    },
} as const satisfies ProfileFixture;
