import { signatureSkills } from "#store/profile/signature-skills";
import { supportingSkills } from "#store/profile/supporting-skills";

import type { ProfileSkillRecord } from "#store/types";

const profileSkillOrder = [
    "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "b2c3d4e5-f6a1-8901-2345-67890abcdef1",
    "c3d4e5f6-a1b2-9012-3456-7890abcdef12",
    "d4e5f6a1-b2c3-0123-4567-890abcdef123",
    "e5f6a1b2-c3d4-1234-5678-90abcdef1234",
    "f6a1b2c3-d4e5-2345-6789-0abcdef12345",
    "a1b2c3d4-e5f6-3456-7890-abcdef123456",
    "e5f6a1b2-c3d4-7890-1234-901234567890",
    "c3d4e5f6-a1b2-5678-9012-cdef12345678",
    "d4e5f6a1-b2c3-6789-0123-def123456789",
    "e5f6a1b2-c3d4-7890-1234-ef1234567890",
    "f6a1b2c3-d4e5-8901-2345-f12345678901",
    "a1b2c3d4-e5f6-9012-3456-123456789012",
    "b2c3d4e5-f6a1-0123-4567-234567890123",
    "c3d4e5f6-a1b2-1234-5678-345678901234",
    "d4e5f6a1-b2c3-2345-6789-456789012345",
    "e5f6a1b2-c3d4-3456-7890-567890123456",
    "f6a1b2c3-d4e5-4567-8901-678901234567",
    "a1b2c3d4-e5f6-5678-9012-789012345678",
    "b2c3d4e5-f6a1-6789-0123-890123456789",
    "c3d4e5f6-a1b2-7890-1234-901234567890",
    "d4e5f6a1-b2c3-8901-2345-012345678901",
    "e5f6a1b2-c3d4-9012-3456-123456789012",
    "f6a1b2c3-d4e5-0123-4567-234567890123",
    "a1b2c3d4-e5f6-1234-5678-345678901234",
    "b2c3d4e5-f6a1-2345-6789-456789012345",
    "c3d4e5f6-a1b2-5678-9012-789012345678",
    "d4e5f6a1-b2c3-6789-0123-890123456789",
    "c3d4e5f6-a1b2-3456-7890-567890123456",
    "d4e5f6a1-b2c3-4567-8901-678901234567",
    "e5f6a1b2-c3d4-5678-9012-789012345678",
    "f6a1b2c3-d4e5-6789-0123-890123456789",
    "a1b2c3d4-e5f6-7890-1234-901234567890",
    "b2c3d4e5-f6a1-8901-2345-012345678901",
    "c3d4e5f6-a1b2-9012-3456-123456789012",
    "d4e5f6a1-b2c3-0123-4567-234567890123",
    "e5f6a1b2-c3d4-1234-5678-345678901234",
    "f6a1b2c3-d4e5-2345-6789-456789012345",
    "a1b2c3d4-e5f6-3456-7890-567890123456",
    "b2c3d4e5-f6a1-4567-8901-678901234567",
    "8f3a1c20-9e7b-4d52-b8a4-c1d2e3f405a1",
    "6b4d5e2c-71a8-4c39-9f02-d7e1a8b3c4d5",
    "2c9f1e3a-4b8d-4612-9a57-e3f4051627d8",
    "5a1b7c9e-3f4d-4821-b5a6-c8d9e0f1a2b3",
    "9d4e2f7a-8c1b-4530-a692-d3e4f50617c8",
    "4f8a2c1e-5d6b-4739-9b8c-a0d1e2f30415",
] as const;
const skillsByUuid = new Map(
    [...signatureSkills, ...supportingSkills].map((skill) => [skill.uuid, skill]),
);

export const profileSkills = profileSkillOrder.map((uuid) => {
    const skill = skillsByUuid.get(uuid);

    if (!skill) {
        throw new Error(`Missing profile skill fixture: ${uuid}`);
    }

    return skill;
}) satisfies readonly ProfileSkillRecord[];
