<template>
  <div v-if="homePageData?.layout">
    <BlockRenderer :blocks="homePageData.layout" />
  </div>
  <div v-else>
    Loading home page content...
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { usePayloadAPI } from '#imports'; // Adjust import if needed based on Nuxt 3 auto-imports

const route = useRoute();
const { fetchGlobal } = usePayloadAPI();

const homePageData = ref(null);

const isDraft = computed(() => route.query.draft === 'true');
const token = computed(() => route.query.token as string | undefined);

onMounted(async () => {
  // Pass draft status and token if available for live preview
  homePageData.value = await fetchGlobal('home', 1, isDraft.value);
  // Note: Payload's live preview handles the token automatically when fetching drafts.
  // We just need to ensure 'draft=true' is passed.
});

// You might need to watch for route changes if the page can be navigated to with different draft/token states
watch(
  () => [route.query.draft, route.query.token],
  async () => {
    homePageData.value = await fetchGlobal('home', 1, isDraft.value);
  }
);
</script>

<style scoped>
/* Add any specific styles for the home preview page here */
</style>
