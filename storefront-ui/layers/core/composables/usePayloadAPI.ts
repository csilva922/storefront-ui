export const usePayloadAPI = () => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const token = useCookie('payload-token')

  if (route.query.token) {
    token.value = route.query.token as string
  }

  const fetchBanners = async () => {
    try {
      const headers = {}
      if (token.value) {
        headers.Authorization = `JWT ${token.value}`
      }

      const res = await $fetch(`${config.public.apiBase}/api/banners`, {
        method: 'GET',
        headers,
      })
      return res
    } catch (error) {
      console.error('Error fetching banners:', error)
      return null
    }
  }

  const fetchBannerByID = async (id: string) => {
    try {
      const headers = {}
     
      const res = await $fetch(`${config.public.apiBase}/api/banners/${id}`, {
        method: 'GET',
        headers,
        params: {
          'draft': true 
        }
      })
      return res
    } catch (error) {
      console.error(`Error fetching banner with ID ${id}:`, error)
      return null
    }
  }

  return { fetchBanners, fetchBannerByID }
}