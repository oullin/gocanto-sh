import { goProjects } from "./go";
import { otherProjects } from "./other";
import { oullinProjects } from "./oullin";
import { phpProjects } from "./php";
import { vueProjects } from "./vue";

import type { ProjectRecord } from "../types";

const projectOrder = [
    "538e5f1d-86f0-4071-b270-6aa61a156612",
    "94478a19-17a0-4be4-8a66-04c12bdfb554",
    "e8ed4398-eb4e-4c72-a647-c862e0aae784",
    "e00a72b2-211d-4650-b22d-88dbdcd49cb9",
    "00a0a12e-6af0-4f5a-b96d-3c95cc7c365c",
    "2d178e11-a584-4e20-a493-3b84007dd358",
    "dc67854e-c8bd-4461-baba-8972bee7bfb5",
    "32fd43ce-d957-4ad2-9d71-b57f71444f2a",
    "b48d8098-962b-4ff9-884e-264ab33256c9",
    "19acd1d7-80ca-4828-88da-d3641f8d05e1",
    "98b5d71a-1c78-4639-a9ed-343a8ba8c328",
    "3ce8b01f-406a-474c-80f3-8426617b42fe",
    "e517a966-f7d0-46a1-9ee4-494b38a116e5",
    "928ac7e8-d0ba-4075-9c22-67050ab03755",
    "de33dc2a-a710-44a3-9413-e886c0498576",
    "03c3e74a-4ce4-4d86-8104-8f2a6f4f85d0",
    "45399ac1-11a7-4678-b366-88690e41a991",
    "031e58b1-726f-48f2-8eac-5659e0b9bd4d",
    "1f9e6cdb-046f-4d2d-8e31-654e570efd6d",
    "b19c190d-12ca-4469-b067-f843e3b18faf",
    "e7367891-db35-48e7-bc58-6fc4812434d2",
    "2049877b-c2e3-4fed-968f-9f17bb08e737",
    "02dbdd7d-12fe-4aa1-ba46-e5d250fa7a7d",
] as const;
const projectsByUuid = new Map(
    [...oullinProjects, ...goProjects, ...phpProjects, ...vueProjects, ...otherProjects].map(
        (project) => [project.uuid, project],
    ),
);

export const projectItems = projectOrder.map((uuid) => {
    const project = projectsByUuid.get(uuid);

    if (!project) {
        throw new Error(`Missing project fixture: ${uuid}`);
    }

    return project;
}) satisfies readonly ProjectRecord[];
