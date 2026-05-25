<script setup lang="ts">
import { defineAsyncComponent, hydrateOnIdle, hydrateOnVisible } from "vue";
import GlobalSearchLoader from "@components/GlobalSearchLoader.vue";
import SiteNav from "@components/SiteNav.vue";
import WorkflowHero from "@components/WorkflowHero.vue";

const ExperienceGrid = defineAsyncComponent({
    loader: () => import("@components/ExperienceGrid.vue"),
    hydrate: hydrateOnVisible({ rootMargin: "320px" }),
});
const ProjectsTable = defineAsyncComponent({
    loader: () => import("@components/ProjectsTable.vue"),
    hydrate: hydrateOnVisible({ rootMargin: "320px" }),
});
const RecommendationsMarquee = defineAsyncComponent({
    loader: () => import("@components/RecommendationsMarquee.vue"),
    hydrate: hydrateOnVisible({ rootMargin: "320px" }),
});
const WhoIAm = defineAsyncComponent({
    loader: () => import("@components/WhoIAm.vue"),
    hydrate: hydrateOnVisible({ rootMargin: "320px" }),
});
const SignatureSkillsGrid = defineAsyncComponent({
    loader: () => import("@components/SignatureSkillsGrid.vue"),
    hydrate: hydrateOnVisible({ rootMargin: "320px" }),
});
const SiteFooter = defineAsyncComponent({
    loader: () => import("@components/SiteFooter.vue"),
    hydrate: hydrateOnVisible({ rootMargin: "320px" }),
});
const BackToTop = defineAsyncComponent({
    loader: () => import("@components/BackToTop.vue"),
    hydrate: hydrateOnIdle(6000),
});
</script>

<template>
    <SiteNav />
    <WorkflowHero />
    <main class="outer">
        <ExperienceGrid />
        <ProjectsTable />
        <RecommendationsMarquee />
        <WhoIAm />
        <SignatureSkillsGrid />
    </main>
    <SiteFooter />
    <BackToTop />
    <GlobalSearchLoader />
</template>
