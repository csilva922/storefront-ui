<script setup lang="ts">
import HomeLayoutRenderer from '~/layers/home/components/HomeLayoutRenderer.vue'
import { usePayloadAPI } from '~/layers/core/composables/usePayloadAPI'

const { fetchGlobal } = usePayloadAPI()
const { data: home } = await useAsyncData(
  'home-global',
  () => fetchGlobal('home', 3),
  { default: () => ({ layout: [] }) }
)
</script>

<template>
   <HomeLayoutRenderer :layout="home.layout || []" />
</template>
