<script setup lang="ts">
import BackToTop from "@components/BackToTop.vue";
import ExperienceGrid from "@components/ExperienceGrid.vue";
import GlobalSearch from "@components/GlobalSearch.vue";
import ProjectsTable from "@components/ProjectsTable.vue";
import RecommendationsMarquee from "@components/RecommendationsMarquee.vue";
import SignatureSkillsGrid from "@components/SignatureSkillsGrid.vue";
import SiteFooter from "@components/SiteFooter.vue";
import SiteNav from "@components/SiteNav.vue";
import WhoIAm from "@components/WhoIAm.vue";
import WorkflowHero from "@components/WorkflowHero.vue";
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
    <GlobalSearch />
</template>
