
<script setup lang="ts">
import type { ContentBlock } from "~/types/payload";
import RichText from '~/layers/core/components/RichText.vue'

const props = defineProps<{
  block: ContentBlock;
}>();
</script>

<template>
    <h2 v-if="block.heading" class="content-heading">
      {{ block.heading }}
    </h2>
    <RichText :content="block.content" />
</template>

<style scoped>
.content-heading {
  margin: 1rem 0;
  font-weight: 600;
}
</style>