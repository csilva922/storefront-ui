<script setup lang="ts">
import MainBanner from '~/layers/core/components/MainBanner.vue'
import Categories from '~/layers/core/components/Categories.vue'
import Content from '~/layers/core/components/Content.vue'

const props = defineProps<{ layout: any[] }>()
</script>

<template>
  <div v-for="(block, i) in props.layout" :key="block.id || i">
    <MainBanner v-if="block.blockType === 'banner' && block.banner" :content="block.banner" />

    <Categories
      v-else-if="block.blockType === 'categories'"
      :content="{ heading: block.heading, items: block.items }"
    />

    <Content v-else-if="block.blockType === 'content'"  :block="block" /> 
    <pre v-else class="p-4 text-xs opacity-60">Unknown block: {{ block.blockType }}</pre>
  </div>
</template>
