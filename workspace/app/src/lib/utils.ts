import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn-vue tooling glue shared by generated UI components.
/** Combines conditional classes and resolves conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
