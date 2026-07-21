<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { Content, onContentUpdated, useData, useRoute } from "vitepress";
import { VPNavBarSearch } from "vitepress/theme";
import { data as posts } from "#writing/posts-data";
import { WritingIndexSearch } from "#writing/search";
import type { TopicSelection } from "#writing/search";

// Implements option 2a of the "Writing" redesign: a dark editorial index with
// a sticky author rail and excerpted essay list. Articles retain their existing
// header, reading progress, TOC, author card, related posts, and footer.

const { page, frontmatter } = useData();
const route = useRoute();

const cleanPath = computed(() => route.path.replace(/index\.html$/, "").replace(/\.html$/, ""));

const isIndex = computed(() => cleanPath.value === "/" || cleanPath.value === "");

const tag = ref<TopicSelection>(WritingIndexSearch.allTopics);

const filtered = computed(() => WritingIndexSearch.filterPosts(posts, "", tag.value));

const topics = computed(() => WritingIndexSearch.tagCounts(posts));

const featured = computed(() => posts[0]);

const listedPosts = computed(() => WritingIndexSearch.listPosts(filtered.value, featured.value));

const countLabel = computed(() => WritingIndexSearch.countLabel(filtered.value.length));

const newestYear = computed(() => posts[0]?.date.year ?? String(
    new Date().getFullYear(),
));

const currentPost = computed(() => {
    const path = cleanPath.value.replace(/\/$/, "");

    return posts.find((p) => p.url.replace(/\/$/, "") === path);
});

const articleTags = computed<string[]>(() => (frontmatter.value.tags as string[]) ?? []);

const related = computed(() => posts.filter((p) => p.url !== currentPost.value?.url).slice(0, 2));

const progressPct = ref("0%");

const activeToc = ref<string | null>(null);

const toc = ref<{ id: string; label: string }[]>(
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
        label: h.textContent?.replace(/​/g, "").trim() ?? "",
    }));
    activeToc.value = toc.value[0]?.id ?? null;
}

function updateScrollState() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;

    progressPct.value = `${max > 0 ? Math.min(100, Math.round((doc.scrollTop / max) * 100)) : 0}%`;

    let active = toc.value[0]?.id ?? null;

    for (const t of toc.value) {
        const el = document.getElementById(t.id);

        if (el && el.getBoundingClientRect().top <= 120) {
            active = t.id;
        }
    }

    activeToc.value = active;
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
    buildToc();
    updateScrollState();
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);

    if (scrollFrame !== null) {
        window.cancelAnimationFrame(scrollFrame);
    }
});

const year = new Date().getFullYear();
</script>

<template>
    <div class="wr">
        <div v-if="isIndex" class="wr-index-shell">
            <aside class="wr-index-rail">
                <a href="/" class="wr-rail-name">Gustavo<br />Ocanto</a>
                <p class="wr-lede">
                    Engineering notes from things I've actually shipped — Go, Laravel, and the edge.
                    Real code from real systems. No slop.
                </p>

                <div class="wr-topics">
                    <div class="wr-topics__label">Topics</div>
                    <div class="wr-topics__list">
                        <button
                            class="wr-topic"
                            :class="{ 'is-active': tag === WritingIndexSearch.allTopics }"
                            :aria-pressed="tag === WritingIndexSearch.allTopics"
                            @click="tag = WritingIndexSearch.allTopics"
                        >
                            All ({{ posts.length }})
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
                            {{ topic.tag }} ({{ topic.count }})
                        </button>
                    </div>
                </div>

                <div class="wr-search wr-rail-search">
                    <VPNavBarSearch />
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
                        <span> · Singapore</span>
                    </div>
                </div>
            </aside>

            <main class="wr-index-main">
                <div class="wr-index-head">
                    <h1>Writing</h1>
                    <span>{{ countLabel }} · {{ newestYear }}</span>
                </div>

                <article v-if="featured" class="wr-essay wr-essay--featured">
                    <div class="wr-essay__latest">Latest — {{ featured.date.display }}</div>
                    <h2>
                        <a :href="featured.url">{{ featured.title }}</a>
                    </h2>
                    <p>{{ featured.description }}</p>
                    <div class="wr-essay__meta">
                        {{ featured.readingTime }} read<span v-if="featured.tags.length">
                            · {{ featured.tags.join(", ") }}</span
                        >
                    </div>
                </article>

                <div class="wr-essay-list">
                    <article v-for="post in listedPosts" :key="post.url" class="wr-essay">
                        <h2>
                            <a :href="post.url">{{ post.title }}</a>
                        </h2>
                        <p>{{ post.description }}</p>
                        <div class="wr-essay__meta">
                            {{ post.date.short }} · {{ post.readingTime
                            }}<span v-if="post.tags.length"> · {{ post.tags.join(", ") }}</span>
                        </div>
                    </article>

                    <div v-if="filtered.length === 0" class="wr-empty">
                        No posts tagged <span>{{ tag }}</span
                        >.
                    </div>
                </div>

                <footer class="wr-index-footer">
                    <span><span class="wr-heart">♥</span> Husband, Father, Brother, and Son</span>
                    <span>© {{ year }} Gustavo Ocanto</span>
                </footer>
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

                            <div class="wr-share">
                                <span class="wr-share__label">Share</span>
                                <a
                                    href="https://x.com/gocanto"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >X / Twitter</a
                                >
                                <a
                                    href="https://news.ycombinator.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >Hacker News</a
                                >
                            </div>

                            <div class="wr-bio">
                                <span class="wr-bio__avatar" aria-hidden="true">
                                    <img
                                        src="/avatar-128.jpg"
                                        alt=""
                                        width="52"
                                        height="52"
                                        decoding="async"
                                    />
                                </span>
                                <div>
                                    <div class="wr-bio__name">Gustavo Ocanto</div>
                                    <p>
                                        Staff engineer working across Go, Laravel, and the edge. I
                                        write down the things that only make sense after they've
                                        broken in production.
                                    </p>
                                </div>
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
                    <div class="wr-footer__cols">
                        <div>
                            <div class="wr-footer__head">WRITING</div>
                            <div class="wr-footer__links">
                                <a href="/">All posts</a>
                                <a href="https://gocanto.sh">gocanto.sh</a>
                            </div>
                        </div>
                        <div>
                            <div class="wr-footer__head">OPEN SOURCE</div>
                            <div class="wr-footer__links">
                                <a
                                    href="https://github.com/gocanto"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >GitHub · gocanto</a
                                >
                            </div>
                        </div>
                        <div>
                            <div class="wr-footer__head">CONNECT</div>
                            <div class="wr-footer__links">
                                <a href="mailto:gustavoocanto@gmail.com">Email</a>
                                <a
                                    href="https://x.com/gocanto"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >X</a
                                >
                            </div>
                        </div>
                    </div>
                    <div class="wr-footer__bottom">
                        <div><span class="wr-heart">♥</span> Husband, Father, Brother, and Son</div>
                        <div>© {{ year }} Gustavo Ocanto</div>
                    </div>
                </footer>
            </div>
        </template>
    </div>
</template>
