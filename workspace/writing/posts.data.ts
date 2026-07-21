import { createContentLoader } from "vitepress";

import { Posts } from "#writing/posts";
import type { Post } from "#writing/posts";

export type { Post } from "#writing/posts";

/**
 * Loaded posts, injected by VitePress for client-side imports of this module.
 *
 * The binding must exist at runtime (not `declare`) because the RSS build path
 * imports this file directly through Node, which type-strips declarations.
 */
export const data: Post[] = [];

export default createContentLoader(
	"posts/*.md",
	{
	    excerpt: true,
	    includeSrc: true,
	    transform: (raw) => Posts.transform(raw),
	},
);
