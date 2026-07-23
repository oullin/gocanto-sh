<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { Content, onContentUpdated, useData, useRoute } from "vitepress";
import { VPNavBarSearch } from "vitepress/theme";
import { data as posts } from "#writing/posts-data";
import { WritingArticlePage } from "#writing/article";
import type { Heading } from "#writing/article";
import { WritingIndexSearch } from "#writing/search";
import type { TopicSelection } from "#writing/search";
import ThemeToggle from "./ThemeToggle.vue";

// Implements the "Blog Home" design: a dark editorial index with a sticky
// author rail (identity, topic counts, "Now" card) and a promoted latest post
// above a dense archive list. Articles retain their existing header, reading
// progress, TOC, related posts, and footer.

const { frontmatter } = useData();
const route = useRoute();

const isIndex = computed(() => WritingArticlePage.isIndex(route.path));

const tag = ref<TopicSelection>(WritingIndexSearch.allTopics);

const filtering = computed(() => WritingIndexSearch.isFiltering(tag.value));

const filtered = computed(() => WritingIndexSearch.filterPosts(posts, tag.value));

const topics = computed(() => WritingIndexSearch.topTopics(posts));

const featured = computed(() => posts[0]);

const listedPosts = computed(() =>
    WritingIndexSearch.archivePosts(filtered.value, featured.value, filtering.value),
);

const countLabel = computed(() =>
    WritingIndexSearch.countLabel(posts.length, filtering.value ? filtered.value.length : null),
);

const yearRange = computed(() => WritingIndexSearch.yearRange(posts));

function clearTopic() {
    tag.value = WritingIndexSearch.allTopics;
}

const currentPost = computed(() => WritingArticlePage.currentPost(posts, route.path));

const articleTags = computed<string[]>(() => WritingArticlePage.tags(frontmatter.value.tags));

const related = computed(() => WritingArticlePage.relatedPosts(posts, currentPost.value));

const progressBar = ref<HTMLElement | null>(null);

const activeToc = ref<string | null>(null);

const showBackToTop = ref(false);

const isElevated = ref(false);

const toc = ref<Heading[]>(
    [],
);

let scrollFrame: number | null = null;

// Resolved once per content update so the scroll handler measures cached nodes
// instead of re-querying the document on every frame.
let tocEls: HTMLElement[] = [];

function buildToc() {
    if (typeof document === "undefined") {
        return;
    }

    const heads = Array.from(document.querySelectorAll<HTMLElement>(".vp-doc h2[id]"));

    tocEls = heads;
    toc.value = heads.map((h) => ({
        id: h.id,
        label: WritingArticlePage.headingLabel(h.textContent),
    }));
    // Left unmarked on purpose: the reader starts above the first heading, and
    // the callers below settle the real state on the same tick.
    activeToc.value = null;
}

function updateScrollState() {
    const doc = document.documentElement;

    // Written straight to the element rather than bound with `:style`: the width
    // changes on every scroll frame, and a reactive ref would re-render the whole
    // layout — header, search, article, TOC — 60 times a second.
    if (progressBar.value) {
        progressBar.value.style.width = WritingArticlePage.progress(
            doc.scrollTop,
            doc.scrollHeight,
            doc.clientHeight,
        );
    }

    showBackToTop.value = WritingArticlePage.showBackToTop(doc.scrollTop);
    isElevated.value = WritingArticlePage.isElevated(doc.scrollTop);

    const offsets = tocEls.map((el) => ({ id: el.id, top: el.getBoundingClientRect().top }));

    activeToc.value = WritingArticlePage.activeHeading(offsets, {
        height: doc.clientHeight,
        scrollTop: doc.scrollTop,
        scrollHeight: doc.scrollHeight,
    });
}

function onScroll() {
    if (scrollFrame !== null) {
        return;
    }

    scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = null;
        updateScrollState();
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToHeading(id: string) {
    const el = document.getElementById(id);

    if (!el) {
        return;
    }

    window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
    });
}

onContentUpdated(() => {
    nextTick(() => {
        buildToc();
        onScroll();
    });
});

onMounted(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    // The activation line is a fraction of the viewport, so a resize moves it.
    window.addEventListener("resize", onScroll, { passive: true });
    buildToc();
    updateScrollState();
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);

    if (scrollFrame !== null) {
        window.cancelAnimationFrame(scrollFrame);
    }
});

const year = new Date().getFullYear();
</script>

<template>
    <div class="wr">
        <button
            class="wr-top"
            :class="{ 'is-visible': showBackToTop }"
            type="button"
            title="Back to top"
            aria-label="Back to top"
            :tabindex="showBackToTop ? 0 : -1"
            :aria-hidden="!showBackToTop"
            @click="scrollToTop"
        >
            <span aria-hidden="true">↑</span>
        </button>

        <div v-if="isIndex" class="wr-index-shell">
            <aside class="wr-index-rail">
                <a href="https://gocanto.sh" class="wr-rail-name">
                    <span class="wr-avatar wr-rail-avatar" aria-hidden="true">
                        <img src="/avatar-128.jpg" alt="" width="46" height="46" decoding="async" />
                    </span>
                    <span class="wr-rail-name__text">
                        <span class="wr-rail-name__label">Gus</span>
                        <span class="wr-rail-name__role">software architect</span>
                    </span>
                </a>
                <!--
                    Copy kept local on purpose. It mirrors the profile bio summary in
                    @gocanto/store, but this package deliberately has no workspace
                    dependencies so the VitePress SEO/build path stays isolated.
                -->
                <p class="wr-lede">
                    Software architect. 20+ years shipping production-grade backends for fintech,
                    banking, and e-commerce.
                </p>

                <nav class="wr-topics" aria-label="Topics">
                    <div class="wr-topics__label">Topics</div>
                    <div class="wr-topics__list">
                        <button
                            class="wr-topic"
                            :class="{ 'is-active': tag === WritingIndexSearch.allTopics }"
                            :aria-pressed="tag === WritingIndexSearch.allTopics"
                            @click="tag = WritingIndexSearch.allTopics"
                        >
                            <span>All</span>
                            <span class="wr-topic__count">{{ posts.length }}</span>
                        </button>
                        <button
                            v-for="topic in topics"
                            :key="topic.tag"
                            class="wr-topic"
                            :class="{ 'is-active': tag === topic.tag }"
                            :aria-pressed="tag === topic.tag"
                            @click="
                                tag = tag === topic.tag ? WritingIndexSearch.allTopics : topic.tag
                            "
                        >
                            <span>{{ topic.tag }}</span>
                            <span class="wr-topic__count">{{ topic.count }}</span>
                        </button>
                    </div>
                </nav>

                <div class="wr-now">
                    <div class="wr-now__label">
                        <span class="wr-now__dot" aria-hidden="true"></span>
                        Now
                    </div>
                    <p>
                        Building <a href="https://github.com/oullin">oag</a>, an AI agent platform
                        in Go for regulated systems, as Lead Software Architect at Oullin Labs.
                    </p>
                </div>

                <div class="wr-rail-bottom">
                    <!-- Force native navigation; VitePress otherwise treats .rss as a page route. -->
                    <a
                        class="wr-subscribe"
                        href="/feed.rss"
                        data-analytics="rss-subscribe"
                        target="_self"
                        type="application/rss+xml"
                        >Subscribe via RSS</a
                    >
                    <div>
                        <a
                            href="https://gocanto.sh"
                            class="wr-site-link"
                            data-analytics="profile-transition"
                            >gocanto.sh</a
                        >
                        <span class="wr-dot" aria-hidden="true">·</span>
                        <span>Singapore</span>
                    </div>
                </div>

                <div class="wr-rail-legal">
                    <div><span class="wr-heart">♥</span> Husband, Father, Brother, and Son</div>
                    <div>© {{ year }} Gustavo Ocanto</div>
                </div>
            </aside>

            <main class="wr-index-main">
                <div class="wr-index-head">
                    <h1>Writing</h1>
                    <span class="wr-index-head__count">{{ countLabel }} · {{ yearRange }}</span>
                    <!-- Same VitePress local-search button the article header uses. -->
                    <div class="wr-search wr-index-search">
                        <VPNavBarSearch />
                    </div>
                    <ThemeToggle />
                </div>

                <article v-if="featured && !filtering" class="wr-essay wr-essay--featured">
                    <div class="wr-essay__lead">
                        <span class="wr-essay__latest">Latest</span>
                        <span class="wr-essay__date">{{ featured.date.display }}</span>
                    </div>
                    <h2>
                        <a :href="featured.url">{{ featured.title }}</a>
                    </h2>
                    <p>{{ featured.description }}</p>
                    <div class="wr-essay__meta">
                        <span>{{ featured.readingTime }} read</span>
                        <span class="wr-dot" aria-hidden="true">·</span>
                        <span v-for="t in featured.tags" :key="t" class="wr-tag">{{ t }}</span>
                        <a :href="featured.url" class="wr-essay__more">Read →</a>
                    </div>
                </article>

                <div v-if="listedPosts.length" class="wr-archive">
                    <a v-for="post in listedPosts" :key="post.url" :href="post.url" class="wr-row">
                        <span class="wr-row__date"
                            >{{ post.date.short }}, {{ post.date.year }}</span
                        >
                        <span class="wr-row__body">
                            <span class="wr-row__title">{{ post.title }}</span>
                            <span v-if="post.tags.length" class="wr-row__tags">{{
                                post.tags.join(" · ")
                            }}</span>
                        </span>
                        <span class="wr-row__end">
                            <span>{{ post.readingTime }}</span>
                            <span class="wr-row__arrow" aria-hidden="true">→</span>
                        </span>
                    </a>
                </div>

                <div v-else-if="filtering" class="wr-empty">
                    <div>
                        Nothing tagged
                        <span>{{ tag }}</span>
                    </div>
                    <button type="button" class="wr-empty__clear" @click="clearTopic">
                        Clear topic
                    </button>
                </div>
            </main>
        </div>

        <template v-else>
            <div ref="progressBar" class="wr-progress"></div>

            <div class="wr-shell">
                <header class="wr-header" :class="{ 'is-elevated': isElevated }">
                    <div class="wr-brand">
                        <a href="https://gocanto.sh" class="wr-brand-home" aria-label="gocanto.sh">
                            <span class="wr-avatar" aria-hidden="true">
                                <img
                                    src="/avatar-128.jpg"
                                    alt=""
                                    width="30"
                                    height="30"
                                    decoding="async"
                                />
                            </span>
                        </a>
                        <a href="/" class="wr-home">All writing</a>
                    </div>
                    <div class="wr-search">
                        <VPNavBarSearch />
                    </div>
                    <ThemeToggle />
                </header>

                <main class="wr-article-wrap">
                    <div class="wr-article-grid">
                        <article class="wr-article">
                            <header class="wr-article__head">
                                <div class="wr-article__tags">
                                    <span
                                        v-for="(t, i) in articleTags"
                                        :key="t"
                                        class="wr-tag"
                                        :class="{ 'wr-tag--accent': i === 0 }"
                                        >{{ t }}</span
                                    >
                                </div>
                                <h1 class="wr-article__title">{{ frontmatter.title }}</h1>
                                <div class="wr-article__meta">
                                    <span>{{ currentPost?.date.display }}</span>
                                    <template
                                        v-if="
                                            currentPost &&
                                            currentPost.modifiedAt !== currentPost.date.raw
                                        "
                                    >
                                        <span class="wr-sep">/</span>
                                        <span>Updated {{ currentPost.modifiedAt }}</span>
                                    </template>
                                    <span class="wr-sep">/</span>
                                    <span>{{ currentPost?.readingTime }} read</span>
                                    <span class="wr-sep">/</span>
                                    <span>Gustavo Ocanto</span>
                                </div>
                            </header>

                            <div class="vp-doc">
                                <Content />
                            </div>

                            <aside class="wr-author" aria-label="About the author">
                                <a
                                    href="https://gocanto.sh/"
                                    class="wr-author__identity"
                                    data-analytics="profile-transition"
                                >
                                    <img
                                        src="/avatar-128.jpg"
                                        alt="Gustavo Ocanto"
                                        width="48"
                                        height="48"
                                    />
                                    <span>
                                        <strong>Gustavo Ocanto</strong>
                                        <small>Software Architect for Regulated Systems</small>
                                    </span>
                                </a>
                                <p>
                                    Twenty-plus years building banking, payment, e-commerce, and
                                    production AI systems in Singapore.
                                </p>
                            </aside>

                            <div v-if="related.length" class="wr-related">
                                <div class="wr-related__label">Related</div>
                                <a
                                    v-for="r in related"
                                    :key="r.url"
                                    :href="r.url"
                                    class="wr-related__item"
                                >
                                    <div class="wr-related__title">{{ r.title }}</div>
                                    <div class="wr-related__meta">
                                        {{ r.date.display }} · {{ r.readingTime }} read
                                    </div>
                                </a>
                            </div>
                        </article>

                        <aside class="wr-aside">
                            <div class="wr-aside__label">On this page</div>
                            <nav class="wr-toc">
                                <a
                                    v-for="item in toc"
                                    :key="item.id"
                                    href="#"
                                    :class="{ 'is-active': activeToc === item.id }"
                                    @click.prevent="scrollToHeading(item.id)"
                                >
                                    <span class="wr-toc__marker"></span>{{ item.label }}
                                </a>
                            </nav>
                        </aside>
                    </div>
                </main>

                <footer class="wr-footer">
                    <div class="wr-footer__bottom">
                        <div><span class="wr-heart">♥</span> Husband, Father, Brother, and Son</div>
                        <div>© {{ year }} Gustavo Ocanto</div>
                    </div>
                </footer>
            </div>
        </template>
    </div>
</template>
