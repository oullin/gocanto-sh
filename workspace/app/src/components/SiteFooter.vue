<script setup lang="ts">
import { footerCopy, profile } from "@data"
</script>

<template>
  <footer>
    <div class="foot-top">
      <div class="brand">
        <img class="brand-logo" :src="profile.avatarUrl" :alt="profile.name" />
        <span>{{ profile.handle }}</span>
      </div>
      <div class="foot-status">
        <span class="dot"></span>
        {{ footerCopy.status }}
      </div>
    </div>
    <div class="foot-bottom">
      <div>{{ footerCopy.copyright }}</div>
      <div>{{ footerCopy.tagline }}</div>
    </div>
  </footer>
</template>
