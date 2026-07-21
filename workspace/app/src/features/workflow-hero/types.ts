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

/** Stable identifiers for workflow tabs and their deferred payloads. */
export type WorkflowId =
    | "lead-qualifier"
    | "meeting-prep"
    | "follow-ups"
    | "data-sync"
    | "reporting"
    | "content-drafting";

/** Lightweight data required to render one workflow tab. */
export type WorkflowMetadata = {
    readonly id: WorkflowId;
    readonly label: string;
    readonly icon: Component;
};

/** Deferred canvas data for one workflow. */
export type WorkflowPayload = {
    readonly connectors: readonly WorkflowConnector[];
    readonly steps: readonly WorkflowStep[];
};

/** A complete workflow ready to render in the canvas. */
export type Workflow = WorkflowMetadata & WorkflowPayload;

/** Loads the deferred canvas data for one workflow. */
export type WorkflowPayloadLoader = () => Promise<WorkflowPayload>;

/** Loader registry keyed by workflow ID. */
export type WorkflowPayloadLoaders = Readonly<Partial<Record<WorkflowId, WorkflowPayloadLoader>>>;

/** Lifecycle state for the currently selected workflow panel. */
export type WorkflowPanelState = "loading" | "ready" | "error";

export type ProofAvatar = {
    readonly src: string;
    readonly alt: string;
};
