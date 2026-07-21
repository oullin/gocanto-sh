import { FileText, PackageCheck, PenLine, ShieldCheck, ShoppingCart, Wand2 } from "lucide-vue-next";

import type { WorkflowPayload } from "@features/workflow-hero/types";

/** Deferred canvas payload for the ecommerce workflow. */
export const ecommercePayload: WorkflowPayload = {
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
            icon: ShoppingCart,
            title: "Checkout Surface",
            description:
                "Multi-tenant marketplace, SaaS checkout, wallet, booking, or partner API surface.",
            details: [
                { text: "Provider mix + currency rules" },
                { text: "Inventory and capacity constraints" },
            ],
            time: "Discovery",
            delay: "early",
            position: "left",
        },
        {
            id: "report-action",
            label: "Architecture",
            labelIcon: Wand2,
            icon: ShieldCheck,
            title: "Resilient Commerce",
            description:
                "Patterns from BeMyGuest: idempotent checkout, modular payment adapters, contract-tested integrations, and audit trails.",
            details: [
                { text: "Adyen, Stripe, PayPal, WeChat, PayDollar" },
                { text: "OpenAPI partner sync" },
                { text: "Ledgering + reconciliation reports" },
            ],
            chip: "Ecommerce-ready",
            time: "10+ gateways",
            model: true,
            modelLabel: "Ollin patterns",
            delay: "middle",
            position: "center",
        },
        {
            id: "report-output",
            label: "Output",
            labelIcon: FileText,
            icon: PackageCheck,
            title: "Revenue-Safe Delivery",
            description:
                "The result is a checkout or integration layer that protects customer trust and finance operations.",
            details: [
                { text: "Retries + dispute hooks" },
                { text: "Immutable critical records" },
                { text: "Regression-tested release path" },
            ],
            time: "Launch-ready",
            delay: "late",
            position: "right",
        },
    ],
};
