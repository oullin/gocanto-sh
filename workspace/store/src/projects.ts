import { projectItems } from "./projects/items";

import type { ProjectsFixture } from "./types";

export const projects = {
    version: "1.0.4",
    data: projectItems,
} as const satisfies ProjectsFixture;
