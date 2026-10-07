import { projectItems } from "#store/projects/items";

import type { ProjectsFixture } from "#store/types";

export const projects = {
    version: "1.0.5",
    data: projectItems,
} as const satisfies ProjectsFixture;
