<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import {
    ArrowUpRight,
    Bot,
    Cable,
    Clipboard,
    CreditCard,
    DatabaseZap,
    FileText,
    Gauge,
    Handshake,
    Landmark,
    Menu,
    PackageCheck,
    PenLine,
    ServerCog,
    ShieldCheck,
    ShoppingCart,
    TrendingUp,
    Wand2,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { profile } from "@gocanto/store";
import type { RecommendationRecord } from "@gocanto/store";

type Detail = {
    text: string;
    asset?: string;
    alt?: string;
};

type Step = {
    id: string;
    label: string;
    labelIcon: typeof PenLine;
    icon: typeof PenLine;
    title: string;
    titleMeta?: string;
    description: string;
    details?: Detail[];
    chip?: string;
    time?: string;
    model?: boolean;
    modelLabel?: string;
    action?: string;
    delay: "early" | "middle" | "late" | "final";
    position: "left" | "center" | "right" | "mobile-only";
};

type Connector = {
    x: number;
    y: number;
    width: number;
    height: number;
    viewBox: string;
    diamond: string;
    line: string;
    arrow: string;
    delay: "middle" | "late" | "final";
};

type Workflow = {
    id: string;
    label: string;
    icon: typeof PenLine;
    connectors: Connector[];
    steps: Step[];
};

type ProofAvatar = {
    src: string;
    alt: string;
};

const activeTab = ref("lead-qualifier");
const panelKey = ref(0);
const tabRefs = ref<HTMLButtonElement[]>([]);
const detailFirstStepIds = new Set([
    "meeting-left",
    "meeting-right",
    "follow-action",
    "data-action",
    "report-action",
    "content-action",
]);

const proofAvatars = ref<ProofAvatar[]>([]);
const testimonialCount = ref(0);
const mailto = `mailto:${profile.data.email}`;

const uniqueRecommendations = (items: readonly RecommendationRecord[]): RecommendationRecord[] => {
    const seen = new Set<string>();
    const unique: RecommendationRecord[] = [];

    for (const item of items) {
        if (seen.has(item.uuid)) {
            continue;
        }

        seen.add(item.uuid);
        unique.push(item);
    }

    return unique;
};

onMounted(async () => {
    const { recommendations } = await import("@gocanto/store/recommendations");
    const unique = uniqueRecommendations(recommendations.data);
    const sorted = [...unique].sort((a, b) => b.created_at.localeCompare(a.created_at));

    testimonialCount.value = unique.length;
    proofAvatars.value = sorted.slice(0, 4).map((r) => ({
        src: `https://oullin.io/images/${r.person.avatar}`,
        alt: r.person.full_name,
    }));
});

const workflows: Workflow[] = [
    {
        id: "lead-qualifier",
        label: "AI Platform",
        icon: Bot,
        connectors: [
            {
                x: 394,
                y: 196,
                width: 121,
                height: 87,
                viewBox: "0 0 121 87",
                diamond: "M6 0L12 6L6 12L0 6L6 0Z",
                line: "M6 6H93.2683C104.314 6 113.268 14.9543 113.268 26V85.671",
                arrow: "M106.91 79.2884L113.268 85.671L119.626 79.2887",
                delay: "middle",
            },
            {
                x: 727,
                y: 248,
                width: 151,
                height: 121,
                viewBox: "0 0 151 121",
                diamond: "M6 108.626L12 114.626L6 120.626L0 114.626L6 108.626Z",
                line: "M6 114.626V27.3579C6 16.3122 14.9543 7.35791 26 7.35791H149.146",
                arrow: "M142.763 1L149.145 7.35817L142.763 13.7158",
                delay: "late",
            },
        ],
        steps: [
            {
                id: "lead-input",
                label: "Source",
                labelIcon: PenLine,
                icon: Bot,
                title: "Ollin Agent Go",
                description: "Shared platform for fixed-scope AI delivery in regulated systems.",
                details: [
                    { text: "Orchestrator and tool registry" },
                    { text: "Markdown knowledge base loader" },
                    { text: "Signed JSONL audit log" },
                ],
                chip: "Platform foundation",
                time: "Build once",
                delay: "early",
                position: "left",
            },
            {
                id: "lead-action",
                label: "Agent",
                labelIcon: Wand2,
                icon: Wand2,
                title: "Generate, Validate, Replay",
                description:
                    "Claude handles the first pass, GPT-4 is available as fallback, and validators fail closed before anything ships.",
                details: [
                    { text: "Provider abstraction" },
                    { text: "Structured output" },
                    { text: "Build, test, lint, security gates" },
                ],
                chip: "Agent-accelerated",
                time: "Hours, not days",
                model: true,
                modelLabel: "Claude + GPT-4 fallback",
                delay: "middle",
                position: "center",
            },
            {
                id: "lead-output",
                label: "Deliverable",
                labelIcon: FileText,
                icon: PackageCheck,
                title: "Reviewable Client Package",
                description:
                    "Senior-engineer code, tests, docs, runbooks, and audit evidence delivered as a fixed-scope sprint.",
                details: [
                    { text: "README and API reference" },
                    { text: "Reproducible artifact manifest" },
                    { text: "Audit trail for review" },
                ],
                chip: "Production-grade",
                time: "Fixed scope",
                action: "Ready for review",
                delay: "late",
                position: "right",
            },
        ],
    },
    {
        id: "meeting-prep",
        label: "Fintech Payments",
        icon: CreditCard,
        connectors: [
            {
                x: 404,
                y: 222,
                width: 243,
                height: 78,
                viewBox: "0 0 243 78",
                diamond: "M6 0L12 6L6 12L0 6L6 0Z",
                line: "M6 6H215.402C226.447 6 235.402 14.9543 235.402 26V75.8754",
                arrow: "M241.77 69.6841L235.411 76.0668L229.054 69.6844",
                delay: "middle",
            },
            {
                x: 409,
                y: 168,
                width: 236,
                height: 109,
                viewBox: "0 0 236 109",
                diamond: "M229.891 0L235.891 6L229.891 12L223.891 6L229.891 0Z",
                line: "M229.823 6V81.1435C229.823 92.1892 220.869 101.144 209.823 101.144H1.00074",
                arrow: "M7.38281 94.7856L1.00019 101.144L7.38252 107.501",
                delay: "middle",
            },
            {
                x: 633,
                y: 168,
                width: 235,
                height: 109,
                viewBox: "0 0 235 109",
                diamond: "M6 0L12 6L6 12L0 6L6 0Z",
                line: "M6.00195 6V81.1435C6.00195 92.1892 14.9563 101.144 26.002 101.144H233.945",
                arrow: "M227.562 94.7856L233.945 101.144L227.563 107.501",
                delay: "late",
            },
            {
                x: 632,
                y: 222,
                width: 245,
                height: 78,
                viewBox: "0 0 245 78",
                diamond: "M238.457 0L244.457 6L238.457 12L232.457 6L238.457 0Z",
                line: "M238.457 6H27.3579C16.3122 6 7.35792 14.9543 7.35792 26V75.8754",
                arrow: "M13.7158 69.6841L7.35765 76.0668L1 69.6844",
                delay: "middle",
            },
        ],
        steps: [
            {
                id: "meeting-left",
                label: "Engineering",
                labelIcon: Wand2,
                icon: ShieldCheck,
                title: "Payments Discipline",
                description:
                    "The patterns Gustavo used across Aspire and BeMyGuest become the default integration shape.",
                details: [
                    { text: "Idempotency on mutating calls" },
                    { text: "Webhook signature verification" },
                    { text: "Retry policy and typed errors" },
                ],
                chip: "Fail closed",
                time: "Code + tests",
                delay: "middle",
                position: "left",
            },
            {
                id: "meeting-input",
                label: "Input",
                labelIcon: PenLine,
                icon: CreditCard,
                title: "Provider + Stack",
                titleMeta: "hara.sh",
                description:
                    "Stripe, Adyen, NETS, or a documented provider surface for Go and TypeScript delivery.",
                delay: "early",
                position: "center",
            },
            {
                id: "meeting-output",
                label: "Handoff",
                labelIcon: FileText,
                icon: PackageCheck,
                title: "Sandbox in 30 Minutes",
                description:
                    "Client engineers receive code, fixtures, docs, hashes, and a complete generation audit log.",
                details: [{ text: "Deliverable zip" }, { text: "SHA256 manifest" }],
                time: "Client-ready",
                delay: "late",
                position: "center",
            },
            {
                id: "meeting-right",
                label: "Agent",
                labelIcon: Wand2,
                icon: Wand2,
                title: "Generate Integration",
                description:
                    "hara.sh emits a typed module, client SDK, OpenAPI contract, Postman collection, and sandbox tests.",
                details: [
                    { text: "Go module + TypeScript client" },
                    { text: "OpenAPI 3.1 + Postman" },
                    { text: "go test, tsc, npm test, gosec" },
                ],
                chip: "Validated output",
                time: "4 hours target",
                delay: "middle",
                position: "right",
            },
        ],
    },
    {
        id: "follow-ups",
        label: "Banking",
        icon: Landmark,
        connectors: [
            {
                x: 404,
                y: 310,
                width: 71,
                height: 15,
                viewBox: "0 0 71 15",
                diamond: "M6 1.35791L12 7.35791L6 13.3579L0 7.35791L6 1.35791Z",
                line: "M6 7.35791H70",
                arrow: "M63.4941 1L69.8768 7.35817L63.4944 13.7158",
                delay: "middle",
            },
            {
                x: 798,
                y: 310,
                width: 71,
                height: 15,
                viewBox: "0 0 71 15",
                diamond: "M6 1.35791L12 7.35791L6 13.3579L0 7.35791L6 1.35791Z",
                line: "M6 7.35791H70",
                arrow: "M63.4941 1L69.8768 7.35817L63.4944 13.7158",
                delay: "late",
            },
        ],
        steps: [
            {
                id: "follow-input",
                label: "Input",
                labelIcon: PenLine,
                icon: Landmark,
                title: "Legacy Surface",
                description:
                    "One AS/400, VCOS, Java monolith, or core-banking surface is scoped for a fixed pilot.",
                details: [
                    { text: "Sparse docs + sample records" },
                    { text: "Security and compliance stakeholders" },
                ],
                time: "Discovery",
                delay: "early",
                position: "left",
            },
            {
                id: "follow-action",
                label: "Modernize",
                labelIcon: Wand2,
                icon: ServerCog,
                title: "Proxy + Controls",
                description:
                    "toku.sh wraps the legacy system with a modern API while preserving auditability and operational control.",
                details: [
                    { text: "Go reverse proxy + OpenAPI" },
                    { text: "Auth, cache, rate limits, circuit breaker" },
                    { text: "Kafka projection when needed" },
                ],
                chip: "AS/400 protected",
                time: "8-12 weeks",
                delay: "middle",
                position: "center",
            },
            {
                id: "follow-output",
                label: "Output",
                labelIcon: FileText,
                icon: Gauge,
                title: "Operational Console",
                description:
                    "Bank teams get traffic, latency, AS/400 health, audit export, and rollback runbooks.",
                details: [
                    { text: "p50/p95/p99 latency" },
                    { text: "Caller + operation audit filters" },
                    { text: "Compliance pack" },
                ],
                time: "Pilot-ready",
                delay: "late",
                position: "right",
            },
        ],
    },
    {
        id: "data-sync",
        label: "Event Pipelines",
        icon: Cable,
        connectors: [
            {
                x: 300,
                y: 306,
                width: 103,
                height: 121,
                viewBox: "0 0 103 121",
                diamond: "M6 0L12 6L6 12L0 6L6 0Z",
                line: "M6 6V93.2683C6 104.314 14.9543 113.268 26 113.268H101.997",
                arrow: "M95.6143 106.91L101.997 113.269L95.6146 119.626",
                delay: "middle",
            },
            {
                x: 613,
                y: 179,
                width: 134,
                height: 121,
                viewBox: "0 0 134 121",
                diamond: "M6 108.626L12 114.626L6 120.626L0 114.626L6 108.626Z",
                line: "M6 114.626V27.3579C6 16.3122 14.9543 7.35791 26 7.35791H132.311",
                arrow: "M125.928 1L132.31 7.35817L125.928 13.7158",
                delay: "late",
            },
            {
                x: 1021,
                y: 224,
                width: 93,
                height: 112,
                viewBox: "0 0 93 112",
                diamond: "M6 0L12 6L6 12L0 6L6 0Z",
                line: "M6 6H64.792C75.8377 6 84.792 14.9543 84.792 26V110.695",
                arrow: "M91.1494 104.146L84.7912 110.528L78.4336 104.146",
                delay: "final",
            },
        ],
        steps: [
            {
                id: "data-input",
                label: "Input",
                labelIcon: PenLine,
                icon: Cable,
                title: "Flow Contract",
                description:
                    "Plain-English or YAML definition of event sources, sinks, semantics, and throughput target.",
                details: [
                    { text: "Kafka or RabbitMQ source" },
                    { text: "Postgres, webhook, S3, or topic sink" },
                ],
                time: "Spec first",
                delay: "early",
                position: "left",
            },
            {
                id: "data-action",
                label: "Generate",
                labelIcon: Wand2,
                icon: DatabaseZap,
                title: "Consumer + DLQ",
                description:
                    "kuda.sh generates the Go pipeline with offset handling, idempotent writes, back-pressure, and replay tooling.",
                details: [
                    { text: "Exactly-once consumer option" },
                    { text: "DLQ with full failure context" },
                    { text: "Schema evolution tests" },
                ],
                time: "3-week build",
                delay: "middle",
                position: "center",
            },
            {
                id: "data-pending",
                label: "Operate",
                labelIcon: Clipboard,
                icon: Gauge,
                title: "Helm + Observability",
                description:
                    "Deployment and operations are part of the package, not an afterthought.",
                details: [
                    { text: "Helm chart + values" },
                    { text: "Grafana dashboard JSON" },
                    { text: "Prometheus alerts" },
                ],
                time: "Deployable",
                action: "Runbook included",
                delay: "late",
                position: "right",
            },
            {
                id: "data-output",
                label: "Output",
                labelIcon: FileText,
                icon: PackageCheck,
                title: "Recoverable Stream",
                description:
                    "The finished system can drain, replay, roll back, and evolve without custom incident scripts.",
                details: [
                    { text: "Lag, throughput, error-rate alerts" },
                    { text: "DLQ replay command" },
                ],
                time: "Production handoff",
                delay: "final",
                position: "mobile-only",
            },
        ],
    },
    {
        id: "reporting",
        label: "Ecommerce",
        icon: ShoppingCart,
        connectors: [
            {
                x: 424,
                y: 310,
                width: 71,
                height: 15,
                viewBox: "0 0 71 15",
                diamond: "M6 1.35791L12 7.35791L6 13.3579L0 7.35791L6 1.35791Z",
                line: "M6 7.35791H70",
                arrow: "M63.4941 1L69.8768 7.35817L63.4944 13.7158",
                delay: "middle",
            },
            {
                x: 818,
                y: 310,
                width: 71,
                height: 15,
                viewBox: "0 0 71 15",
                diamond: "M6 1.35791L12 7.35791L6 13.3579L0 7.35791L6 1.35791Z",
                line: "M6 7.35791H70",
                arrow: "M63.4941 1L69.8768 7.35817L63.4944 13.7158",
                delay: "late",
            },
        ],
        steps: [
            {
                id: "report-input",
                label: "Input",
                labelIcon: PenLine,
                icon: ShoppingCart,
                title: "Checkout Surface",
                description:
                    "Multi-tenant marketplace, SaaS checkout, wallet, booking, or partner API surface.",
                details: [
                    { text: "Provider mix + currency rules" },
                    { text: "Inventory and capacity constraints" },
                ],
                time: "Discovery",
                delay: "early",
                position: "left",
            },
            {
                id: "report-action",
                label: "Architecture",
                labelIcon: Wand2,
                icon: ShieldCheck,
                title: "Resilient Commerce",
                description:
                    "Patterns from BeMyGuest: idempotent checkout, modular payment adapters, contract-tested integrations, and audit trails.",
                details: [
                    { text: "Adyen, Stripe, PayPal, WeChat, PayDollar" },
                    { text: "OpenAPI partner sync" },
                    { text: "Ledgering + reconciliation reports" },
                ],
                chip: "Ecommerce-ready",
                time: "10+ gateways",
                model: true,
                modelLabel: "Ollin patterns",
                delay: "middle",
                position: "center",
            },
            {
                id: "report-output",
                label: "Output",
                labelIcon: FileText,
                icon: PackageCheck,
                title: "Revenue-Safe Delivery",
                description:
                    "The result is a checkout or integration layer that protects customer trust and finance operations.",
                details: [
                    { text: "Retries + dispute hooks" },
                    { text: "Immutable critical records" },
                    { text: "Regression-tested release path" },
                ],
                time: "Launch-ready",
                delay: "late",
                position: "right",
            },
        ],
    },
    {
        id: "content-drafting",
        label: "Query Tuning",
        icon: TrendingUp,
        connectors: [
            {
                x: 226,
                y: 114,
                width: 137,
                height: 223,
                viewBox: "0 0 137 223",
                diamond: "M6 210.038L12 216.038L6 222.038L0 216.038L6 210.038Z",
                line: "M6 216.038V27.3579C6 16.3122 14.9543 7.3579 26 7.3579H135.712",
                arrow: "M129.329 1L135.712 7.35817L129.329 13.7158",
                delay: "middle",
            },
            {
                x: 687,
                y: 168,
                width: 71,
                height: 15,
                viewBox: "0 0 71 15",
                diamond: "M6 1.35791L12 7.35791L6 13.3579L0 7.35791L6 1.35791Z",
                line: "M6 7.35791H70",
                arrow: "M63.4941 1L69.8768 7.35817L63.4944 13.7158",
                delay: "late",
            },
            {
                x: 1031,
                y: 229,
                width: 93,
                height: 112,
                viewBox: "0 0 93 112",
                diamond: "M6 0L12 6L6 12L0 6L6 0Z",
                line: "M6 6H64.792C75.8377 6 84.792 14.9543 84.792 26V110.695",
                arrow: "M91.1494 104.312L84.7912 110.695L78.4336 104.313",
                delay: "final",
            },
        ],
        steps: [
            {
                id: "content-input",
                label: "Input",
                labelIcon: PenLine,
                icon: DatabaseZap,
                title: "Slow Query Signal",
                description: "Postgres or MySQL performance data exposes high-impact query paths.",
                details: [
                    { text: "pg_stat_statements or performance schema" },
                    { text: "Repository migration format" },
                ],
                time: "Local-first",
                delay: "early",
                position: "left",
            },
            {
                id: "content-action",
                label: "Diagnose",
                labelIcon: Wand2,
                icon: Gauge,
                title: "Explain + Fix",
                description:
                    "horu.sh codifies the Aspire-style latency work Gustavo did manually into conservative PR-based suggestions.",
                details: [
                    { text: "EXPLAIN before and after" },
                    { text: "Index or migration draft" },
                    { text: "Expected impact and rollback" },
                ],
                chip: "PR-gated",
                time: "Year 2 agent",
                delay: "middle",
                position: "center",
            },
            {
                id: "content-pending",
                label: "Review",
                labelIcon: Clipboard,
                icon: Clipboard,
                title: "Engineer Approval",
                description:
                    "No write access to production data. The output is a reviewable change, not an auto-applied mutation.",
                details: [{ text: "Read-only database credentials" }, { text: "GitHub/GitLab PR" }],
                time: "Human gate",
                action: "Review PR",
                delay: "late",
                position: "right",
            },
            {
                id: "content-output",
                label: "Output",
                labelIcon: FileText,
                icon: PackageCheck,
                title: "Measured Improvement",
                description:
                    "The PR carries query evidence, migration code, rollback notes, and audit log context.",
                details: [{ text: "Before/after plan evidence" }, { text: "Migration + rollback" }],
                time: "Reviewable",
                delay: "final",
                position: "mobile-only",
            },
        ],
    },
];

const activeWorkflow = computed(
    () => workflows.find((workflow) => workflow.id === activeTab.value) ?? workflows[0],
);

const setTabRef = (el: HTMLButtonElement | null, index: number) => {
    if (el) {
        tabRefs.value[index] = el;
    }
};

const selectTab = async (id: string, focusIndex?: number) => {
    if (activeTab.value !== id) {
        activeTab.value = id;
        panelKey.value += 1;
    }

    if (typeof focusIndex === "number") {
        await nextTick();
        tabRefs.value[focusIndex]?.focus();
    }
};

const onTabKeydown = (event: KeyboardEvent, index: number) => {
    const lastIndex = workflows.length - 1;
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
        nextIndex = index === lastIndex ? 0 : index + 1;
    } else if (event.key === "ArrowLeft") {
        nextIndex = index === 0 ? lastIndex : index - 1;
    } else if (event.key === "Home") {
        nextIndex = 0;
    } else if (event.key === "End") {
        nextIndex = lastIndex;
    }

    if (nextIndex !== null) {
        event.preventDefault();
        void selectTab(workflows[nextIndex].id, nextIndex);
    }
};
</script>

<template>
    <section id="about" class="wf-hero" aria-labelledby="hero-title">
        <div class="wf-hero__intro">
            <div class="wf-hero__frame">
                <div class="wf-hero__copy">
                    <span class="wf-badge">
                        <span class="wf-badge__new">
                            <Handshake class="size-3.5" aria-hidden="true" />
                        </span>
                        <span>Open to work · Fractional CTO · Principal Engineer</span>
                    </span>

                    <h1 id="hero-title" class="wf-hero__title">
                        AI-accelerated software for regulated industries
                    </h1>

                    <p class="wf-hero__lede">
                        I build production-grade backends for fintech, banking, and e-commerce:
                        payment integrations, event pipelines, legacy modernization, and practical
                        AI agents that ship fast and pass audit.
                    </p>

                    <div class="wf-hero__ctas">
                        <Button as="a" :href="mailto" variant="outline" class="wf-cta-primary">
                            <ArrowUpRight class="size-4" aria-hidden="true" />
                            Book a review
                        </Button>
                    </div>

                    <div class="wf-proof">
                        <a
                            href="#testimonials"
                            class="wf-proof__users"
                            aria-label="View testimonials"
                        >
                            <ul class="wf-proof__avatars" aria-label="Testimonials">
                                <li
                                    v-for="avatar in proofAvatars"
                                    :key="avatar.src"
                                    class="wf-proof__avatar"
                                >
                                    <img
                                        :src="avatar.src"
                                        :alt="avatar.alt"
                                        width="36"
                                        height="36"
                                    />
                                </li>
                            </ul>
                            <span v-if="testimonialCount > 0"
                                ><strong>{{ testimonialCount }}+</strong> Testimonials</span
                            >
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="wf-tabs-wrap">
            <div class="wf-tabs-frame">
                <div class="wf-tabs" role="tablist" aria-label="AI agent workflows">
                    <button
                        v-for="(workflow, index) in workflows"
                        :id="`wf-tab-${workflow.id}`"
                        :key="workflow.id"
                        :ref="(el) => setTabRef(el as HTMLButtonElement | null, index)"
                        type="button"
                        class="wf-tab"
                        :class="{ 'is-active': activeTab === workflow.id }"
                        role="tab"
                        :aria-selected="activeTab === workflow.id"
                        :aria-controls="`wf-panel-${workflow.id}`"
                        :tabindex="activeTab === workflow.id ? 0 : -1"
                        @click="selectTab(workflow.id)"
                        @keydown="onTabKeydown($event, index)"
                    >
                        <component :is="workflow.icon" class="size-4" aria-hidden="true" />
                        <span>{{ workflow.label }}</span>
                    </button>
                </div>
            </div>
        </div>

        <div
            :id="`wf-panel-${activeWorkflow.id}`"
            :key="`${activeWorkflow.id}-${panelKey}`"
            class="wf-canvas-wrap"
            role="tabpanel"
            :aria-labelledby="`wf-tab-${activeWorkflow.id}`"
            tabindex="0"
        >
            <div class="wf-canvas">
                <svg class="wf-connectors" viewBox="0 0 1280 604" fill="none" aria-hidden="true">
                    <svg
                        v-for="connector in activeWorkflow.connectors"
                        :key="`${connector.x}-${connector.y}-${connector.viewBox}`"
                        class="wf-connector"
                        :class="`wf-connector--${connector.delay}`"
                        :x="connector.x"
                        :y="connector.y"
                        :width="connector.width"
                        :height="connector.height"
                        :viewBox="connector.viewBox"
                        fill="none"
                    >
                        <path class="wf-connector-diamond" :d="connector.diamond" />
                        <path class="wf-connector-path" :d="connector.line" pathLength="1" />
                        <path class="wf-connector-arrow" :d="connector.arrow" pathLength="1" />
                    </svg>
                </svg>

                <article
                    v-for="step in activeWorkflow.steps"
                    :key="step.id"
                    class="wf-card"
                    :data-step-id="step.id"
                    :class="[`wf-card--${step.position}`, `wf-card--${step.delay}`]"
                >
                    <div class="wf-card__tag">
                        <component :is="step.labelIcon" class="size-4" aria-hidden="true" />
                        <span>{{ step.label }}</span>
                    </div>

                    <div class="wf-card__body">
                        <header class="wf-card__header">
                            <component :is="step.icon" class="size-5" aria-hidden="true" />
                            <h2>{{ step.title }}</h2>
                            <span v-if="step.titleMeta" class="wf-card__meta">{{
                                step.titleMeta
                            }}</span>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                class="wf-card__menu"
                                aria-label="Menu"
                            >
                                <Menu class="size-4" aria-hidden="true" />
                            </Button>
                        </header>

                        <p
                            v-if="step.description && !detailFirstStepIds.has(step.id)"
                            class="wf-card__description"
                        >
                            {{ step.description }}
                        </p>

                        <div v-if="step.details?.length || step.chip" class="wf-card__details">
                            <span v-if="step.chip" class="wf-card__chip">{{ step.chip }}</span>
                            <div
                                v-for="detail in step.details"
                                :key="detail.text"
                                class="wf-card__detail"
                            >
                                <img
                                    v-if="detail.asset"
                                    :src="detail.asset"
                                    :alt="detail.alt ?? ''"
                                    width="18"
                                    height="18"
                                />
                                <span v-else class="wf-card__bullet" aria-hidden="true"></span>
                                <span>{{ detail.text }}</span>
                            </div>
                        </div>

                        <p
                            v-if="step.description && detailFirstStepIds.has(step.id)"
                            class="wf-card__description"
                        >
                            {{ step.description }}
                        </p>

                        <footer
                            v-if="step.time || step.model || step.action"
                            class="wf-card__footer"
                        >
                            <span v-if="step.time" class="wf-card__time">{{ step.time }}</span>
                            <span v-if="step.model" class="wf-card__model">
                                <Bot class="size-[18px]" aria-hidden="true" />
                                {{ step.modelLabel ?? "Claude + GPT-4" }}
                            </span>
                            <span v-if="step.action" class="wf-card__action">
                                <FileText
                                    v-if="step.action === 'File updated'"
                                    class="size-[18px]"
                                    aria-hidden="true"
                                />
                                {{ step.action }}
                            </span>
                        </footer>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>
