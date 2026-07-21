<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { Content, onContentUpdated, useData, useRoute } from "vitepress";
import { VPNavBarSearch } from "vitepress/theme";
import { data as posts } from "#writing/posts-data";
import { WritingArticlePage } from "#writing/article";
import type { Heading } from "#writing/article";
import { WritingIndexSearch } from "#writing/search";
import type { TopicSelection } from "#writing/search";

// Implements the "Blog Home" design: a dark editorial index with a sticky
// author rail (identity, topic counts, "Now" card) and a promoted latest post
// above a dense archive list. Articles retain their existing header, reading
// progress, TOC, related posts, and footer.

const { page, frontmatter } = useData();
const route = useRoute();

const isIndex = computed(() => WritingArticlePage.isIndex(route.path));

const tag = ref<TopicSelection>(WritingIndexSearch.allTopics);

const query = ref("");

const searchInput = ref<HTMLInputElement | null>(null);

const filtering = computed(() => WritingIndexSearch.isFiltering(query.value, tag.value));

const filtered = computed(() => WritingIndexSearch.filterPosts(posts, query.value, tag.value));

const topics = computed(() => WritingIndexSearch.topTopics(posts));

const featured = computed(() => posts[0]);

const listedPosts = computed(() =>
    WritingIndexSearch.archivePosts(filtered.value, featured.value, filtering.value),
);

const countLabel = computed(() =>
    WritingIndexSearch.countLabel(posts.length, filtering.value ? filtered.value.length : null),
);

const yearRange = computed(() => WritingIndexSearch.yearRange(posts));

function clearFilters() {
    tag.value = WritingIndexSearch.allTopics;
    query.value = "";
}

function onSearchHotkey(event: KeyboardEvent) {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") {
        return;
    }

    event.preventDefault();
    searchInput.value?.focus();
}

const currentPost = computed(() => WritingArticlePage.currentPost(posts, route.path));

const articleTags = computed<string[]>(() => WritingArticlePage.tags(frontmatter.value.tags));

const related = computed(() => WritingArticlePage.relatedPosts(posts, currentPost.value));

const progressPct = ref("0%");

const activeToc = ref<string | null>(null);

const showBackToTop = ref(false);

const toc = ref<Heading[]>(
    [],
);

let scrollFrame: number | null = null;

function buildToc() {
    if (typeof document === "undefined") {
        return;
    }

    const heads = Array.from(document.querySelectorAll<HTMLElement>(".vp-doc h2[id]"));

    toc.value = heads.map((h) => ({
        id: h.id,
        label: WritingArticlePage.headingLabel(h.textContent),
    }));
    activeToc.value = toc.value[0]?.id ?? null;
}

function updateScrollState() {
    const doc = document.documentElement;

    progressPct.value = WritingArticlePage.progress(
        doc.scrollTop,
        doc.scrollHeight,
        doc.clientHeight,
    );

    showBackToTop.value = WritingArticlePage.showBackToTop(doc.scrollTop);

    const offsets = toc.value.flatMap((t) => {
        const el = document.getElementById(t.id);

        return el ? [{ id: t.id, top: el.getBoundingClientRect().top }] : [];
    });

    activeToc.value = WritingArticlePage.activeHeading(offsets);
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
    window.addEventListener("keydown", onSearchHotkey);
    buildToc();
    updateScrollState();
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("keydown", onSearchHotkey);

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
                <a href="/" class="wr-rail-name">
                    <span class="wr-avatar wr-rail-avatar" aria-hidden="true">
                        <img src="/avatar-128.jpg" alt="" width="46" height="46" decoding="async" />
                    </span>
                    <span class="wr-rail-name__text">
                        <span class="wr-rail-name__label">Gus</span>
                        <span class="wr-rail-name__role">software architect</span>
                    </span>
                </a>
                <p class="wr-lede">
                    Hands-on software architect. 20 years shipping regulated backends: payments,
                    banking cores, Kafka pipelines, AS/400 modernisation. Now building AI-agentic
                    systems in Go.
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
                        in Go for regulated systems, at Oullin.
                    </p>
                </div>

                <div class="wr-rail-bottom">
                    <!-- Force native navigation; VitePress otherwise treats .rss as a page route. -->
                    <a
                        class="wr-subscribe"
                        href="/feed.rss"
                        target="_self"
                        type="application/rss+xml"
                        >Subscribe via RSS</a
                    >
                    <div>
                        <a href="https://gocanto.sh" class="wr-site-link">gocanto.sh</a>
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
                    <div class="wr-index-search">
                        <span class="wr-index-search__icon" aria-hidden="true">⌕</span>
                        <input
                            ref="searchInput"
                            v-model="query"
                            type="search"
                            aria-label="Search writing"
                            placeholder="Search writing…"
                        />
                        <span class="wr-index-search__key" aria-hidden="true">⌘K</span>
                    </div>
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
                        Nothing matches
                        <span>{{ query.trim() ? `“${query.trim()}”` : "this filter" }}</span>
                    </div>
                    <button type="button" class="wr-empty__clear" @click="clearFilters">
                        Clear filters
                    </button>
                </div>
            </main>
        </div>

        <template v-else>
            <div class="wr-progress" :style="{ width: progressPct }"></div>

            <div class="wr-shell">
                <header class="wr-header">
                    <div class="wr-brand">
                        <span class="wr-avatar" aria-hidden="true">
                            <img
                                src="/avatar-128.jpg"
                                alt=""
                                width="30"
                                height="30"
                                decoding="async"
                            />
                        </span>
                        <a href="/" class="wr-home">Home</a>
                    </div>
                    <div class="wr-search">
                        <VPNavBarSearch />
                    </div>
                </header>

                <main class="wr-article-wrap">
                    <a href="/" class="wr-back">← All writing</a>
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
                                    <span class="wr-sep">/</span>
                                    <span>{{ currentPost?.readingTime }} read</span>
                                    <span class="wr-sep">/</span>
                                    <span>Gustavo Ocanto</span>
                                </div>
                            </header>

                            <div class="vp-doc">
                                <Content />
                            </div>

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
