import type { LinkRecord, LinksFixture, ProfileFixture } from "@gocanto/store";

import { PERSON_ID, SITE_URL } from "#app/lib/site";

/** Store link names that identify Gustavo's external personal profiles. */
export const SAME_AS_NAMES = ["x", "github", "linkedin", "youtube", "instagram"] as const;

type SameAsName = (typeof SAME_AS_NAMES)[number];

type StructuredDataBuilderInput = {
    readonly profile: ProfileFixture;
    readonly links: LinksFixture;
};

type PersonStructuredData = {
    readonly "@type": "Person";
    readonly "@id": string;
    readonly name: string;
    readonly alternateName: string;
    readonly url: string;
    readonly image: string;
    readonly jobTitle: string;
    readonly email: string;
    readonly description: string;
    readonly worksFor: {
        readonly "@type": "Organization";
        readonly name: string;
        readonly url: string;
    };
    readonly knowsAbout: readonly string[];
    readonly sameAs: readonly string[];
};

type WebsiteStructuredData = {
    readonly "@type": "WebSite";
    readonly "@id": string;
    readonly url: string;
    readonly name: string;
    readonly publisher: { readonly "@id": string };
    readonly inLanguage: string;
};

type ProfilePageStructuredData = {
    readonly "@type": "ProfilePage";
    readonly "@id": string;
    readonly url: string;
    readonly name: string;
    readonly mainEntity: { readonly "@id": string };
    readonly dateModified?: string;
};

type StructuredData = {
    readonly "@context": "https://schema.org";
    readonly "@graph": readonly [
        PersonStructuredData,
        WebsiteStructuredData,
        ProfilePageStructuredData,
    ];
};

/** Builds the site's schema.org identity graph from canonical store fixtures. */
export class StructuredDataBuilder {
    private static readonly WEBSITE_ID = `${SITE_URL}#website`;
    private static readonly DESCRIPTION =
        "Singapore-based software architect and principal engineer with 20+ years building regulated systems across banking, payments, e-commerce, and production AI.";
    private static readonly KNOWS_ABOUT = [
        "Software Architecture",
        "AI-Agentic Systems",
        "Go",
        "Distributed Systems",
        "Apache Kafka",
        "Payments",
        "Banking Cores",
        "AS/400 Modernisation",
    ] as const;

    private readonly input: StructuredDataBuilderInput;

    constructor(input: StructuredDataBuilderInput) {
        this.input = input;
    }

    /**
     * Build the Person and WebSite schema.org graph.
     *
     * @returns Structured identity data derived from the supplied store fixtures.
     */
    build(): StructuredData {
        const { profile } = this.input;

        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Person",
                    "@id": PERSON_ID,
                    name: profile.data.name,
                    alternateName: profile.data.nickname,
                    url: SITE_URL,
                    image: `${SITE_URL}avatar.jpg`,
                    jobTitle: profile.data.profession,
                    email: profile.data.email,
                    description: StructuredDataBuilder.DESCRIPTION,
                    worksFor: {
                        "@type": "Organization",
                        name: "Oullin Labs",
                        url: "https://oullin.io/",
                    },
                    knowsAbout: StructuredDataBuilder.KNOWS_ABOUT,
                    sameAs: this.buildSameAs(),
                },
                {
                    "@type": "WebSite",
                    "@id": StructuredDataBuilder.WEBSITE_ID,
                    url: SITE_URL,
                    name: profile.data.name,
                    publisher: { "@id": PERSON_ID },
                    inLanguage: "en-US",
                },
                {
                    "@type": "ProfilePage",
                    "@id": `${SITE_URL}#profile-page`,
                    url: SITE_URL,
                    name: `${profile.data.name} — Software Architect for Regulated Systems`,
                    mainEntity: { "@id": PERSON_ID },
                    ...(profile.data.updated_at ? { dateModified: profile.data.updated_at } : {}),
                },
            ],
        };
    }

    /**
     * Serialize the schema.org graph for an inline JSON-LD script.
     *
     * @returns Pretty-printed JSON without surrounding script tags.
     */
    toScriptContents(): string {
        return JSON.stringify(this.build(), null, 4).replaceAll("<", "\\u003c");
    }

    private buildSameAs(): readonly string[] {
        return SAME_AS_NAMES.map((name) => this.findSameAsLink(name).url);
    }

    private findSameAsLink(name: SameAsName): LinkRecord {
        const link = this.input.links.data.find((candidate) => candidate.name === name);

        if (link === undefined) {
            throw new Error(`Structured data sameAs link is missing from the store: ${name}`);
        }

        return link;
    }
}
