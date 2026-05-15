<script setup lang="ts">
import EngagementCta from "@components/EngagementCta.vue";
import ExperienceGrid from "@components/ExperienceGrid.vue";
import GlobalSearch from "@components/GlobalSearch.vue";
import ProfileHero from "@components/ProfileHero.vue";
import ProjectsTable from "@components/ProjectsTable.vue";
import RecommendationsMarquee from "@components/RecommendationsMarquee.vue";
import SignatureSkillsGrid from "@components/SignatureSkillsGrid.vue";
import SiteFooter from "@components/SiteFooter.vue";
import SiteNav from "@components/SiteNav.vue";
import SkillsSpotlight from "@components/SkillsSpotlight.vue";
import { BorderBeam } from "@components/ui/border-beam";
</script>

<template>
    <SiteNav />
    <main class="outer">
        <BorderBeam />
        <ProfileHero />
        <SkillsSpotlight />
        <GlobalSearch />
        <ExperienceGrid />
        <div class="frame-section frame-spacer" aria-hidden="true"></div>
        <ProjectsTable />
        <SignatureSkillsGrid />
        <div class="frame-section frame-spacer" aria-hidden="true"></div>
        <EngagementCta />
        <div class="frame-section frame-spacer" aria-hidden="true"></div>
        <RecommendationsMarquee />
    </main>
    <SiteFooter />
</template>
