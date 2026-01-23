<script setup lang="ts">
import generateSeo, { type SeoEntity } from '~/utils/buildSEOHelper'
import { useMegaMenuCategories } from '~/layers/core/composables/useMegaMenuCategories'
import { usePayloadAPI } from '~/layers/core/composables/usePayloadAPI'

const { getWebsiteHomepage, websiteHomepage } = useWebsiteHomePage()
const { fetchBanners, fetchCategories } = usePayloadAPI()

const { data: banners } = await useAsyncData(
  'banners',
  () => fetchBanners(),
  { default: () => ({ docs: [] }) }
)

const { data: categories } = await useAsyncData(
  'categories',
  () => fetchCategories(),
  { default: () => ({ docs: [] }) }
)

await getWebsiteHomepage()
useHead(generateSeo<SeoEntity>(websiteHomepage.value, 'Home'))

console.log("Banner data: ", banners)
</script>

<template>
  <div>
      <MainBanner :content="banners.docs[1]" />
      <Categories :content="categories.docs[0]" />
      <BannerRight :content="banners.docs[0]" />
      <LazyProductRecentViewSlider heading="Shop our Best Sellers" />
      <BannerLeft :content="banners.docs[0]" />
  </div>
</template>
