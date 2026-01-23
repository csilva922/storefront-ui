<script setup lang="ts">
import { SfScrollable } from '@storefront-ui/vue'

const props = defineProps({
  content: { type: Object, required: false, default: null },
})

const items = computed(() => {
  if (!props.content) return []
  if (Array.isArray(props.content.items)) return props.content.items
  return [props.content]
})

const heading = computed(() => props.content?.heading || 'Shop by Category')
</script>

<template>
  <div class="narrow-container pt-[40px] pb-[40px] md:pt-[80px] md:pb-[120px] space-y-6 md:space-y-10">
    <h3 class="text-[24px] sm:text-[28px] font-normal mb-[30px] md:mb-[50px]">
      {{ heading }}
    </h3>

    <!-- DESKTOP -->
    <ul class="hidden md:grid grid-cols-3 gap-x-5 gap-y-10">
      <li v-for="(category, index) in items" :key="category.id ?? index">
        <NuxtLink :to="category.link || '#'">
          <NuxtImg
            v-if="category.image?.url"
            :src="category.image.url"
            class="w-full"
            :alt="category.image?.alt || category.name"
            width="400"
            height="300"
          />
          <p class="text-[16px] uppercase tracking-[0.5px] flex items-center gap-3 mt-5">
            {{ category.name }}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19">
              <path d="M17.8348 9.95264C18.0527 9.73467 18.0527 9.37607 17.8348 9.15811L12.7723 4.09561C12.5543 3.87764 12.1957 3.87764 11.9777 4.09561C11.7598 4.31357 11.7598 4.67217 11.9777 4.89014L16.0805 8.99287H0.5625C0.253125 8.99287 0 9.246 0 9.55537C0 9.86475 0.253125 10.1179 0.5625 10.1179H16.0805L11.9777 14.2206C11.7598 14.4386 11.7598 14.7972 11.9777 15.0151C12.1957 15.2331 12.5543 15.2331 12.7723 15.0151L17.8348 9.95264Z" fill="black"/>
            </svg>
          </p>
        </NuxtLink>
      </li>
    </ul>

    <!-- MOBILE -->
    <SfScrollable buttons-placement="none" class="flex gap-4 md:hidden pb-8" :drag="true">
      <div v-for="(category, index) in items" :key="category.id ?? index" class="min-w-[200px] max-w-[300px]">
        <NuxtLink :to="category.link || '#'">
          <NuxtImg
            v-if="category.image?.url"
            :src="category.image.url"
            class="w-full"
            :alt="category.image?.alt || category.name"
            width="200"
            height="200"
          />
          <p class="text-[16px] uppercase tracking-[0.5px] flex items-center gap-3 mt-5">
            {{ category.name }}
          </p>
        </NuxtLink>
      </div>
    </SfScrollable>
  </div>
</template>
