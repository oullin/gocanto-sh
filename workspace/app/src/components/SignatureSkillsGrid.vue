<script setup lang="ts">
import { defineAsyncComponent, ref, markRaw } from "vue";
import { profile, type ProfileSkillRecord } from "@gocanto/data";
import { useInViewReady } from "@lib/useAsyncInView";
import {
    Brain,
    CreditCard,
    Workflow,
    Globe,
    Cloud,
    Server,
    Database,
    Cpu,
    GitBranch,
    Shield,
    Lock,
    Network,
    Activity,
    Webhook,
    Send,
    Container,
    HardDrive,
    Code,
    Terminal,
    Bot,
    Zap,
    Radio,
    Key,
    Layers,
    Box,
} from "lucide-vue-next";
import type { CircuitNode, CircuitConnection } from "./ui/circuit-board";

const CircuitBoard = defineAsyncComponent(() =>
    import("./ui/circuit-board").then((m) => m.CircuitBoard),
);

const PLACEHOLDER_COUNT = 6;

const section = ref<HTMLElement | null>(null);

const skills: readonly ProfileSkillRecord[] = profile.data.skills;

const cells = skills
    .filter((s) => s.signature === true)
    .slice(0, PLACEHOLDER_COUNT)
    .map((s) => ({ title: s.item, description: s.description }));

const ready = useInViewReady(section);

const NODE_SIZE = 12;

const circuitNodes: readonly CircuitNode[] = [
    { id: "client", x: 60, y: 50, icon: markRaw(Globe), size: NODE_SIZE },
    { id: "edge", x: 180, y: 50, icon: markRaw(Cloud), size: NODE_SIZE },
    { id: "send", x: 300, y: 50, icon: markRaw(Send), size: NODE_SIZE },
    { id: "api", x: 420, y: 50, icon: markRaw(Server), size: NODE_SIZE },
    { id: "db", x: 540, y: 50, icon: markRaw(Database), size: NODE_SIZE },

    { id: "shield", x: 60, y: 140, icon: markRaw(Shield), size: NODE_SIZE },
    { id: "lock", x: 180, y: 140, icon: markRaw(Lock), size: NODE_SIZE },
    { id: "net", x: 300, y: 140, icon: markRaw(Network), size: NODE_SIZE },
    { id: "act", x: 420, y: 140, icon: markRaw(Activity), size: NODE_SIZE },
    { id: "hook", x: 540, y: 140, icon: markRaw(Webhook), size: NODE_SIZE },

    { id: "ai", x: 60, y: 240, icon: markRaw(Brain), size: NODE_SIZE },
    { id: "pay", x: 180, y: 240, icon: markRaw(CreditCard), size: NODE_SIZE },
    { id: "pipe", x: 300, y: 240, icon: markRaw(Workflow), size: NODE_SIZE },
    { id: "cpu", x: 420, y: 240, icon: markRaw(Cpu), size: NODE_SIZE },
    { id: "git", x: 540, y: 240, icon: markRaw(GitBranch), size: NODE_SIZE },

    { id: "container", x: 60, y: 340, icon: markRaw(Container), size: NODE_SIZE },
    { id: "disk", x: 180, y: 340, icon: markRaw(HardDrive), size: NODE_SIZE },
    { id: "code", x: 300, y: 340, icon: markRaw(Code), size: NODE_SIZE },
    { id: "term", x: 420, y: 340, icon: markRaw(Terminal), size: NODE_SIZE },
    { id: "bot", x: 540, y: 340, icon: markRaw(Bot), size: NODE_SIZE },

    { id: "zap", x: 120, y: 95, icon: markRaw(Zap), size: NODE_SIZE - 2 },
    { id: "radio", x: 360, y: 95, icon: markRaw(Radio), size: NODE_SIZE - 2 },
    { id: "key", x: 240, y: 190, icon: markRaw(Key), size: NODE_SIZE - 2 },
    { id: "layers", x: 480, y: 290, icon: markRaw(Layers), size: NODE_SIZE - 2 },
    { id: "box", x: 120, y: 290, icon: markRaw(Box), size: NODE_SIZE - 2 },
];

const circuitConnections: readonly CircuitConnection[] = [
    { from: "client", to: "edge", animated: true },
    { from: "edge", to: "send" },
    { from: "send", to: "api", animated: true },
    { from: "api", to: "db", animated: true },
    { from: "client", to: "shield" },
    { from: "edge", to: "lock", animated: true },
    { from: "send", to: "net" },
    { from: "api", to: "act", animated: true },
    { from: "db", to: "hook" },
    { from: "shield", to: "lock" },
    { from: "lock", to: "net" },
    { from: "net", to: "act", animated: true },
    { from: "act", to: "hook" },
    { from: "shield", to: "ai" },
    { from: "lock", to: "pay", animated: true },
    { from: "net", to: "pipe" },
    { from: "act", to: "cpu" },
    { from: "hook", to: "git", animated: true },
    { from: "ai", to: "pay" },
    { from: "pay", to: "pipe", animated: true },
    { from: "pipe", to: "cpu" },
    { from: "cpu", to: "git" },
    { from: "ai", to: "container" },
    { from: "pay", to: "disk" },
    { from: "pipe", to: "code", animated: true },
    { from: "cpu", to: "term" },
    { from: "git", to: "bot", animated: true },
    { from: "container", to: "disk" },
    { from: "disk", to: "code" },
    { from: "code", to: "term", animated: true },
    { from: "term", to: "bot" },
    { from: "edge", to: "zap" },
    { from: "send", to: "radio", animated: true },
    { from: "pay", to: "key" },
    { from: "cpu", to: "layers" },
    { from: "ai", to: "box" },
];
</script>

<template>
    <section ref="section" class="frame-section has-circuit-bg">
        <CircuitBoard
            v-if="ready"
            class="circuit-board-bg"
            :nodes="circuitNodes"
            :connections="circuitConnections"
            :width="600"
            :height="400"
            :pulse-speed="3.5"
            :trace-width="1.25"
        />
        <div class="explore-head">
            <h2>Signature skills</h2>
            <p>Hands-on craft I lean on across every engagement — agentic platforms, payment cores, streaming pipelines, banking legacy.</p>
        </div>
        <div class="explore-grid">
            <a
                v-for="c in cells"
                :key="c.title"
                :href="ready ? '#' : undefined"
                class="explore-card"
                :aria-busy="!ready"
            >
                <h3>
                    <span :class="{ 'sk-shimmer': !ready }">{{ c.title }}</span>
                </h3>
                <p>
                    <span :class="{ 'sk-shimmer': !ready }">{{ c.description }}</span>
                </p>
            </a>
        </div>
    </section>
</template>
