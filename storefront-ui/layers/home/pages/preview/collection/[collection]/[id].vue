<script setup lang="ts">
import { useLivePreview } from '@payloadcms/live-preview-vue'
import { usePayloadAPI } from '~/layers/core/composables/usePayloadAPI'

import MainBanner from '~/layers/core/components/MainBanner.vue'
import Categories from '~/layers/core/components/Categories.vue'
import HomeLayoutRenderer from '~/layers/home/components/HomeLayoutRenderer.vue'

const route = useRoute()
const config = useRuntimeConfig()

const collection = String(route.params.collection || '')
const id = String(route.params.id || '')

const { fetchByID } = usePayloadAPI()

const { data: initial } = await useAsyncData(
  `preview:${collection}:${id}`,
  () => fetchByID(collection, id, true, 3),
  { default: () => null }
)

const { data } = useLivePreview({
  initialData: initial.value,
  serverURL: config.public.payloadURL || 'http://localhost:3000',
  depth: 3,
})
</script>

<template>
  <div class="p-6">
    <MainBanner v-if="collection === 'banners' && data" :content="data" />
    <Categories v-else-if="collection === 'category' && data" :content="data" />
    <HomeLayoutRenderer v-else-if="collection === 'pages' && data?.layout" :layout="data.layout" />

    <pre v-else class="text-xs opacity-70">
      No preview data.
      collection={{ collection }} id={{ id }}
      {{ data }}
    </pre>
  </div>
</template>
