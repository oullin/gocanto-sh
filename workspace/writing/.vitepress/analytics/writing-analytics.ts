/** Defers Vercel vitals and records the small set of SEO conversion transitions. */
export class WritingAnalytics {
    private started = false;

    public start(): void {
        if (
            this.started ||
            typeof window === "undefined" ||
            window.location.protocol !== "https:"
        ) {
            return;
        }

        if (!/^(writing|writing-preview)\.gocanto\.sh$/.test(window.location.hostname)) {
            return;
        }

        this.started = true;
        window.setTimeout(() => void this.inject(), 1_500);
    }

    private async inject(): Promise<void> {
        try {
            const [analytics, speedInsights] = await Promise.all([
                import("@vercel/analytics"),
                import("@vercel/speed-insights"),
            ]);

            analytics.inject();
            speedInsights.injectSpeedInsights();
            document.addEventListener("click", (event) => {
                const element =
                    event.target instanceof Element
                        ? event.target.closest<HTMLElement>("[data-analytics]")
                        : null;

                if (element?.dataset.analytics) {
                    analytics.track("writing_transition", {
                        target: element.dataset.analytics,
                    });
                }
            });
        } catch (error) {
            console.warn("Failed to load writing analytics", error);
        }
    }
}
