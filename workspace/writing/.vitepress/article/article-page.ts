import type { Post } from "#writing/posts";

/** A document heading rendered in the article's "On this page" rail. */
export type Heading = {
    readonly id: string;
    readonly label: string;
};

/** A heading's live offset from the top of the viewport, in pixels. */
export type HeadingOffset = {
    readonly id: string;
    readonly top: number;
};

/** The scroll geometry the reading tracker needs, in pixels. */
export type Viewport = {
    readonly height: number;
    readonly scrollTop: number;
    readonly scrollHeight: number;
};

/** Pure behavior for the post detail page, kept free of Vue and the DOM. */
export class WritingArticlePage {
    /** Scroll distance, in pixels, before the back-to-top button is offered. */
    static readonly backToTopOffset = 400;

    /** Scroll distance, in pixels, before the top bar lifts off the article. */
    static readonly headerElevationOffset = 8;

    /**
     * The highest the activation line may sit, in pixels. It keeps the line clear
     * of the sticky header on short viewports.
     */
    static readonly headingOffset = 120;

    /**
     * Where the activation line sits in a normal viewport: a heading counts as
     * the one being read once it reaches the upper third of the screen.
     */
    static readonly activationRatio = 1 / 3;

    /** Slack, in pixels, for calling the page scrolled to the bottom. */
    static readonly bottomSlack = 2;

    /** Related posts shown beneath an article. */
    static readonly relatedLimit = 2;

    private constructor() {}

    /**
     * The route path reduced to its canonical form. VitePress serves the same
     * page as `/post`, `/post.html`, and `/dir/index.html`, so every path
     * comparison has to go through here first.
     */
    static cleanPath(path: string): string {
        return path.replace(/index\.html$/, "").replace(/\.html$/, "");
    }

    /** True when the route is the writing index rather than a post. */
    static isIndex(path: string): boolean {
        const clean = WritingArticlePage.cleanPath(path);

        return clean === "/" || clean === "";
    }

    /** The post the route points at, matched regardless of a trailing slash. */
    static currentPost(posts: readonly Post[], path: string): Post | undefined {
        const target = WritingArticlePage.stripTrailingSlash(WritingArticlePage.cleanPath(path));

        return posts.find((post) => WritingArticlePage.stripTrailingSlash(post.url) === target);
    }

    /** The article's frontmatter tags, tolerating pages that declare none. */
    static tags(value: unknown): string[] {
        return Array.isArray(value)
            ? value.filter((tag): tag is string => typeof tag === "string")
            : [];
    }

    /** Other posts to surface beneath an article, excluding the one being read. */
    static relatedPosts(
        posts: readonly Post[],
        current?: Post,
        limit = WritingArticlePage.relatedLimit,
    ): Post[] {
        return posts.filter((post) => post.url !== current?.url).slice(0, limit);
    }

    /** The reading-progress bar width, as a CSS percentage. */
    static progress(scrollTop: number, scrollHeight: number, clientHeight: number): string {
        const max = scrollHeight - clientHeight;

        if (max <= 0) {
            return "0%";
        }

        return `${Math.min(100, Math.max(0, Math.round((scrollTop / max) * 100)))}%`;
    }

    /** True once the reader is deep enough in the page to want the top button. */
    static showBackToTop(scrollTop: number): boolean {
        return scrollTop > WritingArticlePage.backToTopOffset;
    }

    /**
     * True once the page has left the top, so the sticky bar can cast a shadow
     * over the article it now overlaps.
     */
    static isElevated(scrollTop: number): boolean {
        return scrollTop > WritingArticlePage.headerElevationOffset;
    }

    /**
     * A heading's TOC label. Markdown anchors inject a zero-width space into the
     * heading text, which would otherwise land in the rail.
     */
    static headingLabel(text: string | null | undefined): string {
        return (text ?? "").replace(/​/g, "").trim();
    }

    /**
     * The heading to mark active: the last one to have reached the activation
     * line, which sits in the upper third of the viewport so a section lights up
     * while it is being read rather than once it is nearly off the top. Nothing
     * is marked while the reader is still above the first heading, and the last
     * heading wins at the foot of the page, where a short final section can never
     * climb to the line.
     */
    static activeHeading(headings: readonly HeadingOffset[], viewport: Viewport): string | null {
        if (headings.length === 0) {
            return null;
        }

        if (
            viewport.scrollTop + viewport.height >=
            viewport.scrollHeight - WritingArticlePage.bottomSlack
        ) {
            return headings[headings.length - 1].id;
        }

        const line = Math.max(
            WritingArticlePage.headingOffset,
            viewport.height * WritingArticlePage.activationRatio,
        );

        let active: string | null = null;

        for (const heading of headings) {
            if (heading.top <= line) {
                active = heading.id;
            }
        }

        return active;
    }

    private static stripTrailingSlash(path: string): string {
        return path.replace(/\/$/, "");
    }
}
