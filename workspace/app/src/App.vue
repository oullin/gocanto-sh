<script setup lang="ts">
import AllGuides from "@components/AllGuides.vue";
import CtaBand from "@components/CtaBand.vue";
import ExploreDocs from "@components/ExploreDocs.vue";
import FeaturedGuides from "@components/FeaturedGuides.vue";
import FeaturedTopics from "@components/FeaturedTopics.vue";
import KbHero from "@components/KbHero.vue";
import SearchRow from "@components/SearchRow.vue";
import SiteFooter from "@components/SiteFooter.vue";
import SiteNav from "@components/SiteNav.vue";
</script>

<template>
    <SiteNav />
    <main class="outer">
        <KbHero />
        <FeaturedTopics />
        <SearchRow />
        <FeaturedGuides />
        <div class="frame-section frame-spacer" aria-hidden="true"></div>
        <AllGuides />
        <ExploreDocs />
        <div class="frame-section frame-spacer" aria-hidden="true"></div>
        <CtaBand />
    </main>
    <SiteFooter />
</template>
