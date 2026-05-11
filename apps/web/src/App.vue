<script setup lang="ts">
import ConnectSection from "@components/ConnectSection.vue"
import CreateSection from "@components/CreateSection.vue"
import JourneySection from "@components/JourneySection.vue"
import MeSection from "@components/MeSection.vue"
import ThemeToggle from "@components/ThemeToggle.vue"
</script>

<template>
  <ThemeToggle />
  <main>
    <MeSection />
    <JourneySection />
    <CreateSection />
    <ConnectSection />
  </main>
</template>
