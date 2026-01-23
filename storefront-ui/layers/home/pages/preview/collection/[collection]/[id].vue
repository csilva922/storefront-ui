<script setup lang="ts">
import { useLivePreview } from '@payloadcms/live-preview-vue'
import MainBanner from '~/layers/core/components/MainBanner.vue'
import Categories from '~/layers/core/components/Categories.vue'

const config = useRuntimeConfig()
const route = useRoute()
const collection = String(route.params.collection || '')
const id = String(route.params.id || '')
const { public: { apiBase, payloadURL } } = config
console.log('payloadURL', payloadURL)

const { data: initial } = await useAsyncData(
  `preview:${collection}:${id}`,
  () => $fetch(`${apiBase}/api/${collection}/${id}`, { 
    query: { draft: 'true', depth: 2, }, 
    credentials: 'include', 
  }),
  { default: () => null }
)


const { data } = useLivePreview({
  initialData: initial.value,
  serverURL: payloadURL,
  depth: 2,
})
</script>

<template>
  <div class="p-6">
    <MainBanner v-if="collection === 'banners' && data" :content="data" />
    <Categories v-else-if="collection === 'category' && data" :content="data" />

    <pre v-else class="text-xs opacity-70">
      No preview data. collection={{ collection }} id={{ id }}
      {{ data }}
    </pre>
  </div>
</template>
