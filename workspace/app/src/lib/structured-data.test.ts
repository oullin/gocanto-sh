// @vitest-environment node
import { describe, expect, it } from "vitest";

import { links, profile } from "@gocanto/store";
import { SAME_AS_NAMES, StructuredDataBuilder } from "@lib/structured-data";

const builder = new StructuredDataBuilder({ profile, links });

describe("StructuredDataBuilder", () => {
    it("builds the canonical Person and WebSite graph", () => {
        const structuredData = builder.build();
        const [person, website] = structuredData["@graph"];

        expect(structuredData["@context"]).toBe("https://schema.org");
        expect(person["@type"]).toBe("Person");
        expect(person["@id"]).toBe("https://gocanto.sh/#person");
        expect(person.email).toBe(profile.data.email);
        expect(person.jobTitle).toBe(profile.data.profession);
        expect(person.sameAs).toEqual([
            "https://x.com/gocanto",
            "https://github.com/gocanto",
            "https://www.linkedin.com/in/gocanto/",
            "https://www.youtube.com/@gocanto",
            "https://www.instagram.com/gocanto",
        ]);
        expect(person.sameAs).not.toContain("https://writing.gocanto.sh");
        expect(website).toEqual(
            expect.objectContaining({
                "@type": "WebSite",
                "@id": "https://gocanto.sh/#website",
                publisher: { "@id": "https://gocanto.sh/#person" },
            }),
        );
    });

    it("keeps every sameAs allowlist entry backed by the store", () => {
        const [person] = builder.build()["@graph"];

        for (const name of SAME_AS_NAMES) {
            const link = links.data.find((candidate) => candidate.name === name);

            expect(link, `${name} must exist in the links fixture`).toBeDefined();

            if (link !== undefined) {
                expect(person.sameAs, `${name} must appear in sameAs`).toContain(link.url);
            }
        }
    });

    it("serializes its output as pretty-printed JSON", () => {
        expect(JSON.parse(builder.toScriptContents())).toEqual(builder.build());
        expect(builder.toScriptContents()).toContain('\n    "@context"');
    });
});
