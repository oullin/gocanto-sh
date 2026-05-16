<script setup lang="ts">
import EngagementCta from "@components/EngagementCta.vue";
import ExperienceGrid from "@components/ExperienceGrid.vue";
import GlobalSearch from "@components/GlobalSearch.vue";
import ProfileHero from "@components/ProfileHero.vue";
import RecommendationsMarquee from "@components/RecommendationsMarquee.vue";
import SignatureSkillsGrid from "@components/SignatureSkillsGrid.vue";
import SiteFooter from "@components/SiteFooter.vue";
import SiteNav from "@components/SiteNav.vue";
import SkillsSpotlight from "@components/SkillsSpotlight.vue";
import WhoIAm from "@components/WhoIAm.vue";
</script>

<template>
    <SiteNav />
    <main class="outer">
        <ProfileHero />
        <SkillsSpotlight />
        <ExperienceGrid />
        <RecommendationsMarquee />
        <WhoIAm />
        <SignatureSkillsGrid />
        <EngagementCta />
    </main>
    <SiteFooter />
    <GlobalSearch />
</template>
