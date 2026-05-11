<script setup lang="ts">
import { Plus } from "lucide-vue-next"
import { ref } from "vue"

import { faqs } from "@data"

const openIndex = ref<number | null>(0)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section id="faq">
    <span class="corner-r" aria-hidden="true"></span>
    <span class="corner-l" aria-hidden="true"></span>
    <div class="section-inner">
      <div class="section-head center">
        <span class="section-eyebrow">FAQ</span>
        <h2 class="section-title">Questions worth answering up front.</h2>
      </div>
      <div class="faq-list">
        <div
          v-for="(item, index) in faqs"
          :key="item.question"
          class="faq-item"
          :class="{ open: openIndex === index }"
        >
          <button
            type="button"
            class="faq-q"
            :aria-expanded="openIndex === index"
            @click="toggle(index)"
          >
            {{ item.question }}
            <Plus class="icon" :size="14" :stroke-width="1.6" aria-hidden="true" />
          </button>
          <div class="faq-a">{{ item.answer }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
