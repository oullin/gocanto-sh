<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import {
    ArrowUpRight,
    BellRing,
    Clipboard,
    FileText,
    Handshake,
    Headphones,
    Laptop,
    Menu,
    PenLine,
    RefreshCw,
    TrendingUp,
    Wand2,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";

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
    icon: typeof TrendingUp;
    connectors: Connector[];
    steps: Step[];
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

const avatars = [
    { src: "/orion/avatar-45.png", alt: "Ali Hussein" },
    { src: "/orion/avatar-59.png", alt: "Sahaj Jain" },
    { src: "/orion/avatar-34.png", alt: "Chánh Đại" },
    { src: "/orion/avatar-58.png", alt: "Julian" },
];

const workflows: Workflow[] = [
    {
        id: "lead-qualifier",
        label: "Lead Qualifier",
        icon: TrendingUp,
        connectors: [
            {
                x: 394,
                y: 246,
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
                label: "Input",
                labelIcon: PenLine,
                icon: FileText,
                title: "New Lead Inquiry",
                description: "Automatically qualify new inbound leads from email or forms.",
                details: [
                    { text: "Company details", asset: "/orion/sheets.png", alt: "Sheets logo" },
                    { text: "LinkedIn profiles", asset: "/orion/linkedin.png", alt: "LinkedIn logo" },
                ],
                chip: "Fetching detail...",
                time: "0.0 sec",
                delay: "early",
                position: "left",
            },
            {
                id: "lead-action",
                label: "Action",
                labelIcon: Wand2,
                icon: Wand2,
                title: "Scoring & Categorization",
                description: "Using AI logic, the lead is scored based on size, industry, and engagement.",
                time: "1.8 sec",
                model: true,
                delay: "middle",
                position: "center",
            },
            {
                id: "lead-output",
                label: "Output",
                labelIcon: FileText,
                icon: FileText,
                title: "Response",
                description: "The agent have prepared a tailored response.",
                details: [{ text: "Lead status, notes, and follow-up are logged in the CRM, ready for the sales team." }],
                chip: "Answer",
                time: "0.0 sec",
                action: "File updated",
                delay: "late",
                position: "right",
            },
        ],
    },
    {
        id: "meeting-prep",
        label: "Meeting Prep",
        icon: Headphones,
        connectors: [
            {
                x: 404,
                y: 288,
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
                y: 288,
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
                label: "Action",
                labelIcon: Wand2,
                icon: Wand2,
                title: "Context Gathering",
                description: "",
                details: [
                    { text: "Collect recent emails" },
                    { text: "Check participant messages" },
                    { text: "Past meeting notes" },
                ],
                chip: "Fetching detail...",
                time: "4 sec",
                model: true,
                delay: "middle",
                position: "left",
            },
            {
                id: "meeting-input",
                label: "Input",
                labelIcon: PenLine,
                icon: Laptop,
                title: "Upcoming Meeting",
                titleMeta: "1:32 AM",
                description: "Four hours before a scheduled event, the agent triggers prep mode.",
                delay: "early",
                position: "center",
            },
            {
                id: "meeting-output",
                label: "Output",
                labelIcon: FileText,
                icon: FileText,
                title: "Meeting Brief Document",
                description: "A polished meeting brief sended to the organizer.",
                details: [{ text: "Attached to the calendar" }],
                time: "0.8 sec",
                delay: "late",
                position: "center",
            },
            {
                id: "meeting-right",
                label: "Action",
                labelIcon: Wand2,
                icon: Wand2,
                title: "Brief Generation",
                description: "",
                details: [
                    { text: "Summaries key points" },
                    { text: "Open tasks" },
                    { text: "Recommended discussion topics" },
                ],
                chip: "Generating",
                time: "1.3 sec",
                model: true,
                delay: "middle",
                position: "right",
            },
        ],
    },
    {
        id: "follow-ups",
        label: "Follow-ups",
        icon: BellRing,
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
                icon: BellRing,
                title: "Trigger Event",
                description: "Email goes unanswered after 48 hours.",
                time: "0.0 sec",
                delay: "early",
                position: "left",
            },
            {
                id: "follow-action",
                label: "Action",
                labelIcon: Wand2,
                icon: Wand2,
                title: "Context Reviews",
                description: "Concise follow-up email summarizing next actions or deliverables.",
                details: [{ text: "Checking points" }, { text: "Preparing points from conversation" }],
                chip: "Drafting message...",
                time: "1.6 sec",
                model: true,
                delay: "middle",
                position: "center",
            },
            {
                id: "follow-output",
                label: "Output",
                labelIcon: FileText,
                icon: FileText,
                title: "Response",
                description: "The agent have prepared a tailored message and waiting for approval.",
                details: [{ text: "Follow-up is queued" }],
                time: "0.3 sec",
                delay: "late",
                position: "right",
            },
        ],
    },
    {
        id: "data-sync",
        label: "Data Sync",
        icon: RefreshCw,
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
                y: 216,
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
                icon: FileText,
                title: "New Data Row",
                description: "Keep data consistent across spreadsheets.",
                details: [{ text: "Data source" }],
                time: "0.0 sec",
                delay: "early",
                position: "left",
            },
            {
                id: "data-action",
                label: "Action",
                labelIcon: Wand2,
                icon: Wand2,
                title: "Schema Mapping",
                description: "AI matches fields between source and target systems.",
                details: [{ text: "Data source" }, { text: "Source validation..." }],
                time: "16 sec",
                model: true,
                delay: "middle",
                position: "center",
            },
            {
                id: "data-pending",
                label: "Pending Confirmation",
                labelIcon: Clipboard,
                icon: Clipboard,
                title: "Pending",
                description: "Posts sync summary to Slack and logs any anomalies for review.",
                details: [{ text: "Data source" }],
                time: "24 min",
                action: "Approve",
                delay: "late",
                position: "right",
            },
            {
                id: "data-output",
                label: "Output",
                labelIcon: FileText,
                icon: FileText,
                title: "Data Updated",
                description: "Adapts to new data patterns and mapping corrections over time.",
                details: [{ text: "Data source" }],
                time: "4.1 sec",
                delay: "final",
                position: "mobile-only",
            },
        ],
    },
    {
        id: "reporting",
        label: "Reporting",
        icon: Clipboard,
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
                icon: Clipboard,
                title: "Scheduled Trigger",
                description: "The agent activates the report workflow.",
                time: "0.0 sec",
                delay: "early",
                position: "left",
            },
            {
                id: "report-action",
                label: "Action",
                labelIcon: Wand2,
                icon: Wand2,
                title: "Data Aggregation",
                description: "Summaries changes, trends, and anomalies using AI-generated analysis.",
                details: [{ text: "Collecting metrics" }, { text: "Analyzing data" }],
                chip: "Insight generation...",
                time: "18 sec",
                model: true,
                delay: "middle",
                position: "center",
            },
            {
                id: "report-output",
                label: "Output",
                labelIcon: FileText,
                icon: FileText,
                title: "Report Formatted",
                description: "Automated weekly or monthly performance reports.",
                details: [{ text: "Report posted" }, { text: "Report posted" }],
                time: "1.1 sec",
                delay: "late",
                position: "right",
            },
        ],
    },
    {
        id: "content-drafting",
        label: "Content Drafting",
        icon: FileText,
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
                y: 219,
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
                icon: FileText,
                title: "Approved Brief",
                description: "Article brief is finalized and marked ready.",
                details: [{ text: "Tone and other guidance" }, { text: "Audience data" }],
                time: "0.0 sec",
                delay: "early",
                position: "left",
            },
            {
                id: "content-action",
                label: "Action",
                labelIcon: Wand2,
                icon: Wand2,
                title: "Draft Generation",
                description: "Verifying cited information and links references.",
                details: [{ text: "First version of content" }],
                chip: "Source verification...",
                time: "16 sec",
                model: true,
                delay: "middle",
                position: "center",
            },
            {
                id: "content-pending",
                label: "Pending Approval",
                labelIcon: Clipboard,
                icon: Clipboard,
                title: "Pending",
                description: "Article brief is finalized and marked ready.",
                details: [{ text: "Drafted content" }],
                time: "6 min",
                action: "Approve",
                delay: "late",
                position: "right",
            },
            {
                id: "content-output",
                label: "Output",
                labelIcon: FileText,
                icon: FileText,
                title: "Ready for Publish",
                description: "The approved version with minor changes.",
                details: [{ text: "Posted" }, { text: "Scheduled on 14/07/26" }],
                time: "4.1 sec",
                delay: "final",
                position: "mobile-only",
            },
        ],
    },
];

const activeWorkflow = computed(() => workflows.find((workflow) => workflow.id === activeTab.value) ?? workflows[0]);

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
                        <span>Open to work</span>
                    </span>

                    <h1 id="hero-title" class="wf-hero__title">
                        Work with AI agent<br />
                        that handles your daily operations
                    </h1>

                    <p class="wf-hero__lede">
                        Automate routine tasks, connect your tools, and let your AI agent coordinate
                        workflows so you can focus on strategy, not busywork.
                    </p>

                    <div class="wf-hero__ctas">
                        <Button as="a" href="#engage" variant="outline" class="wf-cta-primary">
                            <ArrowUpRight class="size-4" aria-hidden="true" />
                            Book a review
                        </Button>
                    </div>

                    <div class="wf-proof">
                        <div class="wf-proof__users">
                            <ul class="wf-proof__avatars" aria-label="Users">
                                <li v-for="avatar in avatars" :key="avatar.src" class="wf-proof__avatar">
                                    <img :src="avatar.src" :alt="avatar.alt" width="36" height="36" />
                                </li>
                            </ul>
                            <span><strong>12K+</strong> Users</span>
                        </div>
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
                            <span v-if="step.titleMeta" class="wf-card__meta">{{ step.titleMeta }}</span>
                            <Button variant="ghost" size="icon-sm" class="wf-card__menu" aria-label="Menu">
                                <Menu class="size-4" aria-hidden="true" />
                            </Button>
                        </header>

                        <p v-if="step.description && !detailFirstStepIds.has(step.id)" class="wf-card__description">
                            {{ step.description }}
                        </p>

                        <div v-if="step.details?.length || step.chip" class="wf-card__details">
                            <span v-if="step.chip" class="wf-card__chip">{{ step.chip }}</span>
                            <div v-for="detail in step.details" :key="detail.text" class="wf-card__detail">
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

                        <p v-if="step.description && detailFirstStepIds.has(step.id)" class="wf-card__description">
                            {{ step.description }}
                        </p>

                        <footer v-if="step.time || step.model || step.action" class="wf-card__footer">
                            <span v-if="step.time" class="wf-card__time">{{ step.time }}</span>
                            <span v-if="step.model" class="wf-card__model">
                                <img src="/orion/chatgpt.png" alt="" width="18" height="18" />
                                GPT-4-1 Mini
                            </span>
                            <span v-if="step.action" class="wf-card__action">
                                <img v-if="step.action === 'File updated'" src="/orion/notion.png" alt="" width="18" height="18" />
                                {{ step.action }}
                            </span>
                        </footer>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>
