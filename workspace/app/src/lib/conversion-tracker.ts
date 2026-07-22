/** Records explicit profile conversion links without coupling components to analytics. */
export class ConversionTracker {
    private listener?: (event: MouseEvent) => void;

    public arm(): void {
        if (typeof document === "undefined" || this.listener) {
            return;
        }

        this.listener = (event) => {
            const element =
                event.target instanceof Element
                    ? event.target.closest<HTMLElement>("[data-analytics]")
                    : null;

            if (element?.dataset.analytics) {
                void this.track(element.dataset.analytics);
            }
        };
        document.addEventListener("click", this.listener);
    }

    private async track(target: string): Promise<void> {
        try {
            const analytics = await import("@vercel/analytics");

            analytics.track("profile_conversion", { target });
        } catch (error) {
            console.warn("Failed to record profile conversion", error);
        }
    }
}
