<script setup lang="ts">
import HomeLayoutRenderer from '../../components/HomeLayoutRenderer.vue'

import { usePayloadAPI } from "~/layers/core/composables/usePayloadAPI";

const route = useRoute();
const { fetchBySlug } = usePayloadAPI();

const collection = "pages";
const slug = String(route.params.slug || '')

const { data: page } = await useAsyncData(
  `page:${slug}`,
  () => fetchBySlug(collection, slug, false, 3),
  { default: () => null }
);

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}
</script>

<template>
  <div v-if="page" class="narrow-container">
    <HomeLayoutRenderer v-if="page.layout" :layout="page.layout" />
  </div>
</template>
