import type { ProjectRecord } from "#store/types";

export const vueProjects = [
    {
        uuid: "2d178e11-a584-4e20-a493-3b84007dd358",
        language: "Vue / TypeScript",
        title: "gocanto.dev — Portfolio",
        excerpt:
            "An earlier iteration of my personal portfolio, built in Vue 3 and TypeScript as a deliberate exercise in shipping something polished without over-engineering it. Documents two decades of full-stack engineering across fintech, insurance, and SaaS — explained in plain language rather than keyword lists. The project also served as the testbed where I first established the design token system, composable SEO utilities, and API store patterns that later carried forward into the Oullin platform.",
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
            "A zero-dependency event bus for Vue.js that keeps inter-component communication explicit, traceable, and free of global state pollution. At the time of release, Vue's built-in event system didn't scale well beyond simple parent-child communication — vuemit filled that gap with a clean subscribe/publish API that worked across component trees without forcing a full state management solution. Shipped to npm and used in production across multiple client engagements where the overhead of Vuex was unjustifiable for the problem size.",
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
            "A Vue component that wraps the Google Places Autocomplete API into a clean, accessible, and configurable input. The component exposes individual address fields — street, city, postcode, country — as distinct mapped outputs rather than forcing consumers to parse a raw Places response themselves. Country restrictions, field mappings, and bias regions are all configurable via props. Addresses the common pain point where Google's SDK API and Vue's reactivity model pull in opposite directions, resolving that tension with a thin but principled adapter layer.",
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
