<script setup lang="ts">
import HomePage from "#app/pages/HomePage.vue";
import AuthorityPage from "#app/pages/AuthorityPage.vue";
import { AppPageRegistry } from "#app/lib/page-registry";

const props = withDefaults(
	defineProps<{ path?: string }>(),
	{ path: "/" },
);

const page = AppPageRegistry.resolve(props.path);
</script>

<template>
    <HomePage v-if="!page" />
    <AuthorityPage v-else :page="page" />
</template>
