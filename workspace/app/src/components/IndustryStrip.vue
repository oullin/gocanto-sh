<script setup lang="ts">
import { industries } from "@data"
</script>

<template>
  <section class="strip">
    <span class="corner-r" aria-hidden="true"></span>
    <span class="corner-l" aria-hidden="true"></span>
    <div class="strip-inner">
      <div class="strip-label">Shipped production systems across</div>
      <div class="strip-row">
        <span v-for="item in industries" :key="item" class="strip-item">{{ item }}</span>
      </div>
    </div>
  </section>
</template>
