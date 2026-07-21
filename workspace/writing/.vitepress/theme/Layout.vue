<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { Content, onContentUpdated, useData, useRoute } from "vitepress";
import { VPNavBarSearch } from "vitepress/theme";
import { data as posts } from "#writing/posts-data";
import { PostSearch } from "#writing/search";

// Implements the "Writing" blog redesign (Writing.dc.html): framed 1180px shell,
// sticky header with VitePress local (full-text) search + ⌘K, reading-progress
// bar, an index view (featured card + tag chips + year groups) and an article
// view (prose + sticky "On this page" TOC + author card + related).

const { page, frontmatter } = useData();
const route = useRoute();

const cleanPath = computed(() => route.path.replace(/index\.html$/, "").replace(/\.html$/, ""));

const isIndex = computed(() => cleanPath.value === "/" || cleanPath.value === "");

const tag = ref("all");

const filtered = computed(() => PostSearch.filter(posts, "", tag.value));

const chips = computed(() => PostSearch.topTags(posts));

const featured = computed(() => posts[0]);

const groups = computed(() => PostSearch.groupByYear(filtered.value, featured.value));

const countLabel = computed(() => PostSearch.countLabel(filtered.value.length));

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

function onScroll() {
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
    onScroll();
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
});

const year = new Date().getFullYear();
</script>

<template>
    <div class="wr">
        <div class="wr-progress" :style="{ width: progressPct }"></div>

        <div class="wr-shell">
            <!-- Header -->
            <header class="wr-header">
                <div class="wr-brand">
                    <span class="wr-avatar" aria-hidden="true">
                        <img src="/avatar-128.jpg" alt="" width="30" height="30" decoding="async" />
                    </span>
                    <a href="/" class="wr-home">Home</a>
                </div>
                <div class="wr-search">
                    <VPNavBarSearch />
                </div>
            </header>

            <!-- Index view -->
            <main v-if="isIndex" class="wr-index">
                <div class="wr-hero">
                    <h1 class="wr-h1">Writing</h1>
                    <p class="wr-lede">
                        Engineering notes from things I've actually shipped — Go, Laravel, and the
                        edge. Real code from real systems. No slop.
                    </p>
                    <div class="wr-actions">
                        <!-- Force a native navigation; VitePress otherwise treats .rss as a page route. -->
                        <a
                            class="wr-subscribe"
                            href="/feed.rss"
                            target="_self"
                            type="application/rss+xml"
                        >
                            <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                                aria-hidden="true"
                            >
                                <path d="M4 11a9 9 0 0 1 9 9"></path>
                                <path d="M4 4a16 16 0 0 1 16 16"></path>
                                <circle
                                    cx="5"
                                    cy="19"
                                    r="1.5"
                                    fill="currentColor"
                                    stroke="none"
                                ></circle>
                            </svg>
                            Subscribe
                        </a>
                    </div>
                </div>

                <a v-if="featured" :href="featured.url" class="wr-featured">
                    <div class="wr-featured__side">
                        <div class="wr-featured__kicker">Latest</div>
                        <div>
                            <div class="wr-featured__date">{{ featured.date.display }}</div>
                            <div class="wr-featured__read">{{ featured.readingTime }} read</div>
                        </div>
                        <div class="wr-featured__tags">
                            <span
                                v-for="t in featured.tags.slice(0, 3)"
                                :key="t"
                                class="wr-chip-tag"
                                >{{ t }}</span
                            >
                        </div>
                    </div>
                    <div class="wr-featured__main">
                        <h2 class="wr-featured__title">{{ featured.title }}</h2>
                        <p class="wr-featured__excerpt">{{ featured.description }}</p>
                        <span class="wr-featured__cta"
                            >Read the post <span class="wr-arrow">→</span></span
                        >
                    </div>
                </a>

                <div class="wr-filter">
                    <div class="wr-chips">
                        <button
                            v-for="c in chips"
                            :key="c"
                            class="wr-chip"
                            :class="{ 'is-active': tag === c }"
                            @click="tag = tag === c ? 'all' : c"
                        >
                            {{ c === "all" ? "All" : c }}
                        </button>
                    </div>
                    <div class="wr-count">{{ countLabel }}</div>
                </div>

                <div class="wr-groups">
                    <section v-for="g in groups" :key="g.year" class="wr-year">
                        <div class="wr-year__head">
                            <h3>{{ g.year }}</h3>
                            <span>{{ g.count }}</span>
                        </div>
                        <a v-for="p in g.items" :key="p.url" :href="p.url" class="wr-row">
                            <div class="wr-row__date">
                                {{ p.date.short }}<br /><span>{{ p.readingTime }}</span>
                            </div>
                            <div class="wr-row__body">
                                <h4>{{ p.title }}</h4>
                                <p>{{ p.description }}</p>
                                <div class="wr-row__tags">
                                    <span v-for="t in p.tags.slice(0, 3)" :key="t" class="wr-tag">{{
                                        t
                                    }}</span>
                                </div>
                            </div>
                        </a>
                    </section>
                    <div v-if="filtered.length === 0" class="wr-empty">
                        No posts tagged <span>{{ tag }}</span
                        >.
                    </div>
                </div>
            </main>

            <!-- Article view -->
            <main v-else class="wr-article-wrap">
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
                                    Staff engineer working across Go, Laravel, and the edge. I write
                                    down the things that only make sense after they've broken in
                                    production.
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

            <!-- Footer -->
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
    </div>
</template>
