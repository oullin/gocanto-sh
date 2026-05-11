<script setup lang="ts">
import { Code2, MapPin, ShieldCheck } from "lucide-vue-next"

import { profile, proofLinks, skills } from "@/data"
import ProfileCard from "@/components/ProfileCard.vue"
import ProofLinks from "@/components/ProofLinks.vue"
import SectionHeader from "@/components/SectionHeader.vue"
</script>

<template>
  <div class="relative border-b pb-20">
    <SectionHeader title="About Gus" :description="profile.intro" />

    <div>
      <h1 class="text-center text-sm uppercase text-muted-foreground">{{ profile.title }}</h1>
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
      <span
        v-for="skill in skills"
        :key="skill"
        class="rounded-md border bg-background px-3 py-1 text-xs uppercase text-muted-foreground"
      >
        {{ skill }}
      </span>
    </div>

    <div class="page-container mt-8 grid gap-3 px-6 text-sm text-muted-foreground md:grid-cols-2">
      <div class="flex items-center justify-center gap-2 rounded-md border border-dashed p-3">
        <MapPin class="size-4" aria-hidden="true" />
        {{ profile.location }}
      </div>
      <div class="flex items-center justify-center gap-2 rounded-md border border-dashed p-3">
        <ShieldCheck class="size-4" aria-hidden="true" />
        Production-grade architecture
      </div>
      <div class="flex items-center justify-center gap-2 rounded-md border border-dashed p-3 md:col-span-2">
        <Code2 class="size-4" aria-hidden="true" />
        Go, TypeScript, Node.js, PHP, JavaScript, and Java
      </div>
    </div>
  </div>
</template>
