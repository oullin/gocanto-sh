<script setup lang="ts">
import ConnectSection from "@components/ConnectSection.vue";
import CtaSection from "@components/CtaSection.vue";
import FaqSection from "@components/FaqSection.vue";
import FeaturesSection from "@components/FeaturesSection.vue";
import GridRails from "@components/GridRails.vue";
import IndustryStrip from "@components/IndustryStrip.vue";
import JourneySection from "@components/JourneySection.vue";
import NavBar from "@components/NavBar.vue";
import ProfileCardSection from "@components/ProfileCardSection.vue";
import SiteFooter from "@components/SiteFooter.vue";
</script>

<template>
    <GridRails />
    <NavBar />
    <main>
        <ProfileCardSection />
        <IndustryStrip />
        <FeaturesSection />
        <JourneySection />
        <FaqSection />
        <ConnectSection />
        <CtaSection />
    </main>
    <SiteFooter />
</template>
