<script setup lang="ts">
import MainBanner from '~/layers/core/components/MainBanner.vue'
import Categories from '~/layers/core/components/Categories.vue'
import BannerLeft from '~/layers/core/components/BannerLeft.vue'
import BannerRight from '~/layers/core/components/BannerRight.vue'

const props = defineProps<{
  layout: any[]
}>()
</script>

<template>
  <div v-for="(block, i) in props.layout" :key="block.id || i">
    <MainBanner v-if="block.blockType === 'banner' && block.banner" :content="block.banner" />

    <Categories v-else-if="block.blockType === 'categories'"
      :content="{ heading: block.heading, items: block.items }" />

    <pre v-else class="p-4 text-xs opacity-60">
      Unknown block: {{ block.blockType }}
    </pre>
  </div>
</template>
