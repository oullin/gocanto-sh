import { profileSkills } from "./profile/skills";

import type { ProfileFixture } from "./types";

export const profile = {
    version: "1.0.3",
    data: {
        nickname: "gus",
        handle: "gocanto",
        name: "Gustavo Ocanto",
        email: "gus@oullin.io",
        profession: "Software Architect & Principal Engineer",
        skills: profileSkills,
    },
} as const satisfies ProfileFixture;
