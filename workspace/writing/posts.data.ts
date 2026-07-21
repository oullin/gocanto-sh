import { createContentLoader } from "vitepress";

import { Posts } from "#writing/posts";
import type { Post } from "#writing/posts";

export type { Post } from "#writing/posts";

// VitePress replaces this module's client-side import with the loaded data.
// The binding must exist at runtime (not `declare`) because the RSS build path
// imports this file directly through Node, which type-strips declarations.
export const data: Post[] = [];

export default createContentLoader("posts/*.md", {
    excerpt: true,
    includeSrc: true,
    transform: (raw) => Posts.transform(raw),
});
