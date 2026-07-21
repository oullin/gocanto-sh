/** Workflow types exposed by the feature. */
export type {
    ProofAvatar,
    Workflow,
    WorkflowConnector,
    WorkflowDelay,
    WorkflowDetail,
    WorkflowPosition,
    WorkflowStep,
} from "#app/features/workflow-hero/types";

/** Curated workflow definitions displayed by the hero. */
export { workflows } from "#app/features/workflow-hero/data";

/** Testimonial-proof state for the hero introduction. */
export { useTestimonialProof } from "#app/features/workflow-hero/useTestimonialProof";

/** Interactive tab state and keyboard navigation for workflow selection. */
export { useWorkflowTabs } from "#app/features/workflow-hero/useWorkflowTabs";
