<script setup lang="ts">
import generateSeo, { type SeoEntity } from '~/utils/buildSEOHelper'
import { useMegaMenuCategories } from '~/layers/core/composables/useMegaMenuCategories'
import { usePayloadAPI } from '~/layers/core/composables/usePayloadAPI'
import { useLivePreview } from '@payloadcms/live-preview-vue'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const { getWebsiteHomepage, websiteHomepage } = useWebsiteHomePage()
const { categoriesForMegaMenu } = useMegaMenuCategories()
const { fetchBanners, fetchBannerByID } = usePayloadAPI()

const isPreview = computed(() => route.query.preview === 'true')
const previewCollection = computed(() => String(route.query.collection || ''))
const previewId = computed(() => String(route.query.id || ''))

const { data: banners } = await useAsyncData(
  'banners',
  () => fetchBanners(),
  { default: () => ({ docs: [] }) }
)

const { data: previewBanner } = await useAsyncData(
  () => `preview-banner:${previewId.value}`,
  async () => {
    if (!isPreview.value) return null
    if (previewCollection.value !== 'banners') return null
    if (!previewId.value) return null
    return await fetchBannerByID(previewId.value)
  },
  { default: () => null }
)

const { data: liveBanner } = useLivePreview({
  initialData: previewBanner.value,
  serverURL: runtimeConfig.public.payloadURL || 'http://localhost:3000',
  depth: 2,
})

await getWebsiteHomepage()
useHead(generateSeo<SeoEntity>(websiteHomepage.value, 'Home'))
</script>

<template>
  <div>
      <MainBanner v-if="banners?.docs?.[2]" :content="banners.docs[2]" />
      <Categories :items="categoriesForMegaMenu" />
      <BannerRight v-if="banners?.docs?.[0]" :content="banners.docs[0]" />
      <LazyProductRecentViewSlider heading="Shop our Best Sellers" />
      <BannerLeft v-if="banners?.docs?.[0]" :content="banners.docs[0]" />
  </div>
</template>
