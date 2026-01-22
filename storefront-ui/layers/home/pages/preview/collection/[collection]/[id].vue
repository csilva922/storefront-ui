<script setup lang="ts">
import { useLivePreview } from '@payloadcms/live-preview-vue'
import MainBanner from '~/layers/core/components/MainBanner.vue'

const route = useRoute()
const collection = String(route.params.collection)
const id = String(route.params.id)
const payloadURL = 'http://localhost:3000'

const { data: initial } = await useAsyncData(
  `preview:${collection}:${id}`,
  () => $fetch(`${payloadURL}/api/${collection}/${id}`, { query: { draft: 'true' } }),
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
    <pre v-else>{{ data }}</pre>
  </div>
</template>