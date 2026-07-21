import { describe, expect, it } from "vitest";

import { Skills } from "#domain/skills/skills";

describe("skills domain", () => {
    it("groups signature skills and derives stable display helpers", () => {
        const fixture = {
            version: "1.0.0",
            data: {
                nickname: "gc",
                handle: "gocanto",
                name: "Gocanto",
                email: "hello@example.com",
                profession: "Engineer",
                skills: [
                    {
                        uuid: "skill",
                        percentage: 90,
                        item: "System Design",
                        description: "Architecture",
                        signature: true,
                    },
                ],
            },
        } as const;

        expect(Skills.signatureCells(fixture)[0]?.iconKey).toBe("layers");
        expect(
        	Skills.initials("Go (Programming Language)"),
        ).toBe("GP");
        expect(
        	["green", "blue", "purple", "amber"],
        ).toContain(Skills.chipVariant("Kafka"));
    });
});
