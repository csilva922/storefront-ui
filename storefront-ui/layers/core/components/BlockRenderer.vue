
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const props = defineProps<{
  blocks: Array<any>;
}>();

const components = {
  'banner': defineAsyncComponent(() => import('~/layers/core/components/MainBanner.vue')),
  'category': defineAsyncComponent(() => import('~/layers/core/components/Categories.vue')),
};

const resolveBlockComponent = (blockType: string) => {
  const component = components[blockType];
  if (!component) {
    console.warn(`Block component for type "${blockType}" not found.`);
  }
  return component;
};
</script>

<template>
  <div>
    <template v-for="(block, index) in blocks" :key="index">
      <component :is="resolveBlockComponent(block.__component)" :content="block" />
    </template>
  </div>
</template>
