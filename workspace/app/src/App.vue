<script setup lang="ts">
import { defineAsyncComponent, hydrateOnIdle, hydrateOnVisible } from "vue";
import GlobalSearchLoader from "#app/components/GlobalSearchLoader.vue";
import SiteNav from "#app/components/SiteNav.vue";
import WorkflowHero from "#app/components/WorkflowHero.vue";

const ExperienceGrid = defineAsyncComponent(
    {
        loader: () => import("#app/components/ExperienceGrid.vue"),
        hydrate: hydrateOnVisible({ rootMargin: "320px" }),
    },
);
const ProjectsTable = defineAsyncComponent(
    {
        loader: () => import("#app/components/ProjectsTable.vue"),
        hydrate: hydrateOnVisible({ rootMargin: "320px" }),
    },
);
const RecommendationsMarquee = defineAsyncComponent(
    {
        loader: () => import("#app/components/RecommendationsMarquee.vue"),
        hydrate: hydrateOnVisible({ rootMargin: "320px" }),
    },
);
const WhoIAm = defineAsyncComponent(
    {
        loader: () => import("#app/components/WhoIAm.vue"),
        hydrate: hydrateOnVisible({ rootMargin: "320px" }),
    },
);
const SignatureSkillsGrid = defineAsyncComponent(
    {
        loader: () => import("#app/components/SignatureSkillsGrid.vue"),
        hydrate: hydrateOnVisible({ rootMargin: "320px" }),
    },
);
const SiteFooter = defineAsyncComponent(
    {
        loader: () => import("#app/components/SiteFooter.vue"),
        hydrate: hydrateOnVisible({ rootMargin: "320px" }),
    },
);
const BackToTop = defineAsyncComponent(
    {
        loader: () => import("#app/components/BackToTop.vue"),
        hydrate: hydrateOnIdle(6000),
    },
);
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
