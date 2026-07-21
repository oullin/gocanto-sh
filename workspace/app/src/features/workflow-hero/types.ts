import type { Component } from "vue";

/** Animation phase assigned to a workflow element. */
export type WorkflowDelay = "early" | "middle" | "late" | "final";

/** Horizontal placement of a workflow step. */
export type WorkflowPosition = "left" | "center" | "right" | "mobile-only";

/** Supporting detail displayed within a workflow step. */
export type WorkflowDetail = {
    readonly text: string;
    readonly asset?: string;
    readonly alt?: string;
};

/** A single visual step in a workflow. */
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

/** SVG geometry connecting workflow steps. */
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

/** Complete workflow definition rendered by the hero. */
export type Workflow = {
    readonly id: string;
    readonly label: string;
    readonly icon: Component;
    readonly connectors: readonly WorkflowConnector[];
    readonly steps: readonly WorkflowStep[];
};

/** Testimonial avatar shown as social proof. */
export type ProofAvatar = {
    readonly src: string;
    readonly alt: string;
};
