import type {
    Workflow,
    WorkflowId,
    WorkflowMetadata,
    WorkflowPayload,
    WorkflowPayloadLoaders,
} from "#app/features/workflow-hero/types";

/** Classified failure returned when a deferred workflow payload cannot load. */
export class WorkflowLoadError extends Error {
    readonly _tag = "WorkflowLoadError";

    /**
     * Create a contained workflow loading failure.
     *
     * @param workflowId - ID of the payload that failed to load.
     * @param cause - Original loader failure or missing registry entry.
     */
    constructor(
        readonly workflowId: WorkflowId,
        readonly cause: unknown,
    ) {
        super(`Unable to load workflow ${workflowId}`);
    }
}

/** Result of requesting a workflow payload. */
export type WorkflowLoadResult =
    | { readonly _tag: "loaded"; readonly workflow: Workflow }
    | { readonly _tag: "failed"; readonly error: WorkflowLoadError };

/** Owns deferred workflow requests and caches successful and in-flight loads by ID. */
export class WorkflowLoader {
    private readonly metadata = new Map<WorkflowId, WorkflowMetadata>();
    private readonly loaded = new Map<WorkflowId, Workflow>();
    private readonly pending = new Map<WorkflowId, Promise<WorkflowLoadResult>>();

    /**
     * Create a workflow payload loader.
     *
     * @param registry - Lightweight metadata for all available workflows.
     * @param defaultWorkflow - Synchronous workflow rendered on first paint.
     * @param loaders - Deferred payload loaders keyed by workflow ID.
     */
    constructor(
        registry: readonly WorkflowMetadata[],
        defaultWorkflow: Workflow,
        private readonly loaders: WorkflowPayloadLoaders,
    ) {
        for (const entry of registry) {
            this.metadata.set(entry.id, entry);
        }

        this.loaded.set(defaultWorkflow.id, defaultWorkflow);
    }

    /** Return a synchronously available cached workflow, if present. */
    get(workflowId: WorkflowId): Workflow | null {
        return this.loaded.get(workflowId) ?? null;
    }

    /** Load one workflow while containing loader rejection as a typed result. */
    load(workflowId: WorkflowId): Promise<WorkflowLoadResult> {
        const cached = this.loaded.get(workflowId);

        if (cached) {
            return Promise.resolve({ _tag: "loaded", workflow: cached });
        }

        const inFlight = this.pending.get(workflowId);

        if (inFlight) {
            return inFlight;
        }

        const metadata = this.metadata.get(workflowId);
        const loader = this.loaders[workflowId];

        if (!metadata || !loader) {
            return Promise.resolve({
                _tag: "failed",
                error: new WorkflowLoadError(workflowId, "Payload loader is not registered"),
            });
        }

        const request = this.loadPayload(metadata, loader);

        this.pending.set(workflowId, request);

        return request;
    }

    private async loadPayload(
        metadata: WorkflowMetadata,
        loader: () => Promise<WorkflowPayload>,
    ): Promise<WorkflowLoadResult> {
        try {
            const payload = await loader();

            const workflow: Workflow = { ...metadata, ...payload };

            this.loaded.set(metadata.id, workflow);

            return { _tag: "loaded", workflow };
        } catch (cause: unknown) {
            return {
                _tag: "failed",
                error: new WorkflowLoadError(metadata.id, cause),
            };
        } finally {
            this.pending.delete(metadata.id);
        }
    }
}
