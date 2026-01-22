<script setup lang="ts">
import { useLivePreview } from '@payloadcms/live-preview-vue'

const props = defineProps<{
  initialData: any
  serverURL: string
}>()

const { data } = useLivePreview({
  initialData: props.initialData,
  serverURL: props.serverURL,
  depth: 2,
})
</script>

<template>
  <div>
    <p class="p-2 text-xs opacity-70">Preview loaded: {{ !!data }}</p>
    <MainBanner v-if="data" :content="data" />
    <pre v-else class="p-4">No data yet</pre>
  </div>
</template>
