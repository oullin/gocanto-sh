<script setup lang="ts">
import CareerLog from "@components/CareerLog.vue";
import HeroSection from "@components/HeroSection.vue";
import SiteFooter from "@components/SiteFooter.vue";
import StatsGrid from "@components/StatsGrid.vue";
import TopBar from "@components/TopBar.vue";
</script>

<template>
    <div class="frame">
        <TopBar />
        <HeroSection />
        <StatsGrid />
        <CareerLog />
        <SiteFooter />
    </div>
</template>
