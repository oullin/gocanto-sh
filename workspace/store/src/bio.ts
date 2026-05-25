import type { BioFixture } from "#store/types";

export const bio = {
    version: "1.0.0",
    data: {
        tagline: "Same person whether you're an engineer, a founder, or a recruiter.",
        note: "Born in Venezuela, Singaporean citizen, Singapore-based since 2017. Two decades in software. Half of it as an engineer, half as the engineer who builds the team around me.",
        paragraphs: [
            "<em>I write software that handles real money and real customers.</em> Banks, online stores, and more recently AI assistants that do real work instead of just chatting. The common thread across all of it: when this system fails, somebody loses money or trust, and that's the part I take seriously.",
            "I started in my early twenties in Valencia, Venezuela, building CMSes and city-hall systems in PHP. Eighteen years later I'm still doing the same thing, just at a different scale: today the “websites” handle millions of transactions and the “small business” is sometimes a regional bank.",
            "Along the way I've been a senior engineer, a tech lead, an engineering manager, and now a founder. <em>I prefer staying close to the code.</em> The titles change; the work, careful, audited, end-to-end, does not.",
            "Outside the screen: husband, runner, and a slow but stubborn believer that good software is mostly about taking other people seriously.",
        ],
        quick_facts: [
            { key: "Based in", value: "Singapore" },
            { key: "Originally from", value: "Venezuela 🇻🇪 · Singaporean citizen 🇸🇬" },
            { key: "Years shipping", value: "20+" },
            { key: "Languages", value: "English · Spanish" },
            { key: "Open to", value: "Fractional CTO · Architecture reviews · Select full-time" },
            { key: "Not open to", value: "Agency cycles · Crypto · Surveillance work" },
        ],
    },
} as const satisfies BioFixture;
