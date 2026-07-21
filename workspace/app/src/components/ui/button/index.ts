import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

/** Styled button component. */
export { default as Button } from "#app/components/ui/button/Button.vue";

/** Variant classes shared by button-like controls. */
export const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[2px] focus-visible:ring-[var(--ring-alpha-hover)] focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
	        variants: {
	            variant: {
	                default:
	                    "border border-primary bg-primary text-primary-foreground shadow-[inset_0_1px_1px_oklch(1_0_0_/_0.45),0_2px_10px_oklch(0_0_0_/_0.35)] hover:bg-[var(--btn-primary-bg-hover)] hover:border-[var(--btn-primary-bg-hover)]",
	                destructive:
	                    "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
	                outline:
	                    "border border-border bg-[var(--surface-tint)] text-foreground shadow-none hover:border-[var(--ring-alpha-hover)] hover:bg-[var(--surface-tint-hover)] hover:text-foreground",
	                secondary:
	                    "border border-border bg-secondary text-secondary-foreground hover:border-[var(--ring-alpha-hover)] hover:bg-[var(--surface-tint-hover)]",
	                ghost: "hover:bg-[var(--surface-tint-hover)] hover:text-foreground",
	                link: "text-primary underline-offset-4 hover:underline",
	            },
	            size: {
	                default: "h-9 px-4 py-2 has-[>svg]:px-3",
	                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
	                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
	                icon: "size-9",
	                "icon-sm": "size-8",
	                "icon-lg": "size-10",
	            },
	        },
	        defaultVariants: {
	            variant: "default",
	            size: "default",
	        },
	    },
);

/** Props accepted by the button variant generator. */
export type ButtonVariants = VariantProps<typeof buttonVariants>;
