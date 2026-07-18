---
title: Writing
description: Engineering notes by Gustavo Ocanto — Go, Laravel, and the edge.
aside: false
---

<script setup>
import { data as posts } from "./posts.data";
</script>

# Writing

Engineering notes from things I've actually shipped — Go, Laravel, and the edge.
Real code from real systems. No slop.

<ul class="post-list">
  <li v-for="post of posts" :key="post.url" class="post-item">
    <a :href="post.url" class="post-link">{{ post.title }}</a>
    <p class="post-meta">
      <time :datetime="post.date.raw">{{ post.date.display }}</time>
      <span v-if="post.tags.length"> · {{ post.tags.join(", ") }}</span>
    </p>
    <p class="post-desc">{{ post.description }}</p>
  </li>
</ul>

<style scoped>
.post-list {
  list-style: none;
  padding: 0;
  margin: 2rem 0 0;
}
.post-item {
  padding: 1.25rem 0;
  border-top: 1px solid var(--vp-c-divider);
}
.post-link {
  font-size: 1.2rem;
  font-weight: 600;
}
.post-meta {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.post-desc {
  margin: 0.5rem 0 0;
  color: var(--vp-c-text-2);
}
</style>
