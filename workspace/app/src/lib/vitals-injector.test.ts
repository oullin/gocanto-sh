import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { VitalsInjector } from "@lib/vitals-injector";
import type { VitalsEnvironment } from "@lib/vitals-injector";

type Listener = EventListenerOrEventListenerObject;

class BrowserHarness {
    readonly loader = vi.fn(async () => Promise.resolve());
    readonly addWindowEventListener = vi.fn(
        (type: string, listener: Listener) => this.windowListeners.set(type, listener),
    );
    readonly removeWindowEventListener = vi.fn();
    readonly addDocumentEventListener = vi.fn(
        (type: string, listener: Listener) => this.documentListeners.set(type, listener),
    );
    readonly removeDocumentEventListener = vi.fn();
    readonly requestIdleCallback = vi.fn(
        (callback: IdleRequestCallback, _options?: IdleRequestOptions) => {
            this.idleCallback = callback;
            return 1;
        },
    );

    visibilityState: DocumentVisibilityState = "visible";

    private readonly windowListeners = new Map<string, Listener>();
    private readonly documentListeners = new Map<string, Listener>();
    private idleCallback: IdleRequestCallback | undefined;

    createWindow(withIdleCallback = false): Window & typeof globalThis {
        const fakeWindow = {
            addEventListener: this.addWindowEventListener,
            removeEventListener: this.removeWindowEventListener,
            ...(withIdleCallback ? { requestIdleCallback: this.requestIdleCallback } : {}),
        };

        // SAFETY: VitalsInjector only accesses the event listener methods and optional
        // requestIdleCallback supplied above; the remaining Window members are irrelevant here.
        return fakeWindow as unknown as Window & typeof globalThis;
    }

    createDocument(): Document {
        const fakeDocument = {
            addEventListener: this.addDocumentEventListener,
            removeEventListener: this.removeDocumentEventListener,
            visibilityState: this.visibilityState,
        };
        Object.defineProperty(fakeDocument, "visibilityState", {
            get: () => this.visibilityState,
        });

        // SAFETY: VitalsInjector only accesses the event listener methods and visibilityState
        // supplied above; the remaining Document members are irrelevant to these tests.
        return fakeDocument as unknown as Document;
    }

    fireIdleCallback(): void {
        const callback = this.idleCallback;

        if (callback === undefined) {
            throw new Error("No idle callback was registered");
        }

        callback({
            didTimeout: false,
            timeRemaining: () => 50,
        });
    }

    fireWindowEvent(type: string): void {
        this.fireListener(this.windowListeners, type);
    }

    fireDocumentEvent(type: string): void {
        this.fireListener(this.documentListeners, type);
    }

    private fireListener(listeners: Map<string, Listener>, type: string): void {
        const listener = listeners.get(type);

        if (listener === undefined) {
            throw new Error(`No ${type} listener was registered`);
        }

        const event = new Event(type);

        if (typeof listener === "function") {
            listener(event);
            return;
        }

        listener.handleEvent(event);
    }
}

const enabledEnvironment: VitalsEnvironment = {
    prod: true,
    protocol: "https:",
    hostname: "gocanto.com",
};

describe("VitalsInjector", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("applies the gating truth table", () => {
        const harness = new BrowserHarness();
        const injector = new VitalsInjector(
            harness.loader,
            harness.createWindow(),
            harness.createDocument(),
        );
        const cases: ReadonlyArray<{
            readonly environment: VitalsEnvironment;
            readonly expected: boolean;
        }> = [
            { environment: enabledEnvironment, expected: true },
            { environment: { ...enabledEnvironment, prod: false }, expected: false },
            { environment: { ...enabledEnvironment, protocol: "http:" }, expected: false },
            { environment: { ...enabledEnvironment, hostname: "localhost" }, expected: false },
            { environment: { ...enabledEnvironment, hostname: "127.0.0.1" }, expected: false },
            {
                environment: { ...enabledEnvironment, hostname: "foo.localhost" },
                expected: false,
            },
        ];

        for (const testCase of cases) {
            expect(injector.shouldInject(testCase.environment)).toBe(testCase.expected);
        }
    });

    it("injects idempotently", () => {
        const harness = new BrowserHarness();
        const injector = new VitalsInjector(
            harness.loader,
            harness.createWindow(),
            harness.createDocument(),
        );

        injector.inject();
        injector.inject();

        expect(harness.loader).toHaveBeenCalledOnce();
    });

    it("does not arm when gated off", () => {
        const harness = new BrowserHarness();
        const injector = new VitalsInjector(
            harness.loader,
            harness.createWindow(true),
            harness.createDocument(),
        );

        injector.arm({ ...enabledEnvironment, prod: false });

        expect(harness.requestIdleCallback).not.toHaveBeenCalled();
        expect(harness.addWindowEventListener).not.toHaveBeenCalled();
        expect(harness.addDocumentEventListener).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    it("injects from the idle trigger", () => {
        const harness = new BrowserHarness();
        const injector = new VitalsInjector(
            harness.loader,
            harness.createWindow(true),
            harness.createDocument(),
        );

        injector.arm(enabledEnvironment);
        harness.fireIdleCallback();

        expect(harness.requestIdleCallback).toHaveBeenCalledWith(expect.any(Function), {
            timeout: 3000,
        });
        expect(harness.loader).toHaveBeenCalledOnce();
    });

    it("injects from the 1500ms fallback timer when requestIdleCallback is absent", () => {
        const harness = new BrowserHarness();
        const injector = new VitalsInjector(
            harness.loader,
            harness.createWindow(),
            harness.createDocument(),
        );

        injector.arm(enabledEnvironment);
        vi.advanceTimersByTime(1499);
        expect(harness.loader).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(harness.loader).toHaveBeenCalledOnce();
    });

    it("injects only once across interaction triggers", () => {
        const harness = new BrowserHarness();
        const injector = new VitalsInjector(
            harness.loader,
            harness.createWindow(),
            harness.createDocument(),
        );

        injector.arm(enabledEnvironment);
        harness.fireWindowEvent("pointerdown");
        harness.fireWindowEvent("keydown");

        expect(harness.loader).toHaveBeenCalledOnce();
    });

    it("injects when hidden and detaches the visibilitychange listener", () => {
        const harness = new BrowserHarness();
        const injector = new VitalsInjector(
            harness.loader,
            harness.createWindow(),
            harness.createDocument(),
        );

        injector.arm(enabledEnvironment);
        harness.fireDocumentEvent("visibilitychange");
        expect(harness.loader).not.toHaveBeenCalled();

        harness.visibilityState = "hidden";
        harness.fireDocumentEvent("visibilitychange");

        expect(harness.loader).toHaveBeenCalledOnce();
        expect(harness.removeDocumentEventListener).toHaveBeenCalledWith(
            "visibilitychange",
            expect.any(Function),
        );
    });
});
