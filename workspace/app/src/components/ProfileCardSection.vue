<script setup lang="ts">
import { profile, profileCardCopy } from "@data"
</script>

<template>
  <section class="profile-card-section">
    <div class="profile-card-inner">
      <div class="profile-card">
        <span class="profile-corner profile-corner-tl" aria-hidden="true"></span>
        <span class="profile-corner profile-corner-tr" aria-hidden="true"></span>
        <span class="profile-corner profile-corner-bl" aria-hidden="true"></span>
        <span class="profile-corner profile-corner-br" aria-hidden="true"></span>

        <div class="profile-avatar">
          <img :src="profile.avatarUrl" :alt="profile.name" />
        </div>

        <div class="profile-body">
          <span
            class="profile-flag"
            role="img"
            :aria-label="profileCardCopy.flag.label"
            :title="profileCardCopy.flag.label"
          >{{ profileCardCopy.flag.emoji }}</span>

          <div class="profile-name-row">
            <h2 class="profile-name">{{ profile.name }}</h2>
          </div>
          <div class="profile-role">{{ profileCardCopy.role }}</div>

          <a
            class="profile-knowmore"
            :href="profileCardCopy.knowMore.href"
            :target="profileCardCopy.knowMore.external ? '_blank' : undefined"
            :rel="profileCardCopy.knowMore.external ? 'noreferrer' : undefined"
          >
            {{ profileCardCopy.knowMore.label }}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
