<script setup lang="ts">
import { Code2, MapPin, ShieldCheck } from "lucide-vue-next"

import ProfileCard from "@components/ProfileCard.vue"
import ProofLinks from "@components/ProofLinks.vue"
import SectionHeader from "@components/SectionHeader.vue"
import { profile, proofLinks, skills, technologySkillsLabel } from "@data"
import { Badge } from "@ui/badge"
import { Card } from "@ui/card"
</script>

<template>
  <div class="relative border-b pb-20">
    <SectionHeader title="About Gus" :description="profile.intro" />

    <div>
      <p class="text-center text-sm uppercase text-muted-foreground">{{ profile.title }}</p>
      <div class="page-container grid items-center justify-center gap-8 lg:grid-cols-3">
        <h2 class="mt-6 text-center text-lg font-medium md:text-xl">
          {{ profile.leftStatement }}
        </h2>

        <ProfileCard :image-url="profile.avatarUrl" :name="profile.shortName" />

        <h2 class="mt-6 text-center text-lg font-medium md:text-xl">
          {{ profile.rightStatement }}
        </h2>
      </div>
    </div>

    <ProofLinks :items="proofLinks" />

    <div class="page-container mt-8 flex flex-wrap justify-center gap-2 px-6">
      <Badge
        v-for="skill in skills"
        :key="skill"
        variant="outline"
        class="bg-background px-3 py-1 font-normal uppercase text-muted-foreground"
      >
        {{ skill }}
      </Badge>
    </div>

    <div class="page-container mt-8 grid gap-3 px-6 text-sm text-muted-foreground md:grid-cols-2">
      <Card class="flex items-center justify-center gap-2 border-dashed p-3 shadow-none">
        <MapPin class="size-4" aria-hidden="true" />
        {{ profile.location }}
      </Card>
      <Card class="flex items-center justify-center gap-2 border-dashed p-3 shadow-none">
        <ShieldCheck class="size-4" aria-hidden="true" />
        Production-grade architecture
      </Card>
      <Card class="flex items-center justify-center gap-2 border-dashed p-3 shadow-none md:col-span-2">
        <Code2 class="size-4" aria-hidden="true" />
        {{ technologySkillsLabel }}
      </Card>
    </div>
  </div>
</template>
