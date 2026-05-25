import type { Component } from "vue";

export type WorkflowDelay = "early" | "middle" | "late" | "final";
export type WorkflowPosition = "left" | "center" | "right" | "mobile-only";

export type WorkflowDetail = {
    readonly text: string;
    readonly asset?: string;
    readonly alt?: string;
};

export type WorkflowStep = {
    readonly id: string;
    readonly label: string;
    readonly labelIcon: Component;
    readonly icon: Component;
    readonly title: string;
    readonly titleMeta?: string;
    readonly description: string;
    readonly details?: readonly WorkflowDetail[];
    readonly chip?: string;
    readonly time?: string;
    readonly model?: boolean;
    readonly modelLabel?: string;
    readonly action?: string;
    readonly delay: WorkflowDelay;
    readonly position: WorkflowPosition;
};

export type WorkflowConnector = {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly viewBox: string;
    readonly diamond: string;
    readonly line: string;
    readonly arrow: string;
    readonly delay: Exclude<WorkflowDelay, "early">;
};

export type Workflow = {
    readonly id: string;
    readonly label: string;
    readonly icon: Component;
    readonly connectors: readonly WorkflowConnector[];
    readonly steps: readonly WorkflowStep[];
};

export type ProofAvatar = {
    readonly src: string;
    readonly alt: string;
};
