import type { ProjectRecord } from "#store/types";

export const vueProjects = [
    {
        uuid: "2d178e11-a584-4e20-a493-3b84007dd358",
        language: "Vue / TypeScript",
        title: "gocanto.dev: Portfolio",
        excerpt:
            "An earlier iteration of my personal portfolio, built in Vue 3 and TypeScript as an exercise in shipping something polished without over-engineering it. It documents two decades of full-stack engineering across fintech, insurance, and SaaS in plain language, not keyword lists. It was also the testbed where I first built the design token system, composable SEO utilities, and API store patterns that later carried into the Oullin platform.",
        url: "https://github.com/oullin-link/gocanto-dev-client",
        is_open_source: true,
        icon: "Briefcase",
        published_at: "2024-09-29",
        sort: 15,
    },
    {
        uuid: "b48d8098-962b-4ff9-884e-264ab33256c9",
        language: "Vue / JS",
        title: "vuemit",
        excerpt:
            "A zero-dependency event bus for Vue.js that keeps inter-component communication explicit and out of global state. At release, Vue's built-in event system didn't scale past simple parent-child communication, so vuemit filled the gap with a subscribe/publish API that worked across component trees without a full state management solution. Shipped to npm and used in production on client engagements where Vuex was too much for the problem size.",
        url: "https://github.com/gocanto/vuemit",
        is_open_source: true,
        icon: "Zap",
        published_at: "2021-08-11",
        sort: 20,
    },
    {
        uuid: "19acd1d7-80ca-4828-88da-d3641f8d05e1",
        language: "Vue / JS",
        title: "google-autocomplete",
        excerpt:
            "A Vue component that wraps the Google Places Autocomplete API into an accessible, configurable input. It exposes individual address fields, street, city, postcode, and country, as distinct mapped outputs, so consumers don't parse a raw Places response themselves. Country restrictions, field mappings, and bias regions are all configurable via props. It resolves the tension between Google's SDK and Vue's reactivity model with a thin adapter layer.",
        url: "https://github.com/gocanto/google-autocomplete",
        is_open_source: true,
        icon: "MapPin",
        published_at: "2021-08-11",
        sort: 21,
    },
    {
        uuid: "45399ac1-11a7-4678-b366-88690e41a991",
        language: "Vue / Vite",
        title: "go-maps",
        excerpt:
            "An interactive visualiser for Go's map internals, built to make bucket growth, hashing, and lookup behaviour easier to understand through direct experimentation.",
        url: "https://github.com/gocanto/go-maps",
        is_open_source: true,
        icon: "Map",
        published_at: "2026-02-26",
        sort: 4,
    },
] as const satisfies readonly ProjectRecord[];
