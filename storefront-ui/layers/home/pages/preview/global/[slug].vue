<script setup lang="ts">
import { useLivePreview } from '@payloadcms/live-preview-vue'
import MainBanner from '~/layers/core/components/MainBanner.vue'
import Categories from '~/layers/core/components/Categories.vue'

const route = useRoute()
const slug = String(route.params.slug || '')
const payloadURL = 'http://localhost:3000'
const locale = String(route.query.locale || '')

const { data: initial } = await useAsyncData(
  `preview:global:${slug}:${locale}`,
  () =>
    $fetch(`${payloadURL}/api/globals/${slug}`, {
      query: { draft: 'true', depth: 3, ...(locale ? { locale } : {}) },
    }),
  { default: () => null }
)

const { data } = useLivePreview({
  initialData: initial.value,
  serverURL: payloadURL,
  depth: 3,
})
</script>

<template>
  <div class="p-6">
    <template v-if="slug === 'home' && data?.layout?.length">
      <template v-for="(block, i) in data.layout" :key="block.id ?? i">
        <MainBanner
          v-if="block.blockType === 'banner' && block.banner"
          :content="block.banner"
        />

        <Categories
          v-else-if="block.blockType === 'categories' && block.items"
          :content="Array.isArray(block.items) ? { items: block.items, heading: block.heading } : { items: [block.items], heading: block.heading }"
        />

        <pre v-else class="text-xs opacity-50">Unknown block: {{ block.blockType }}</pre>
      </template>
    </template>

    <pre v-else class="text-xs">{{ data }}</pre>
  </div>
</template>
