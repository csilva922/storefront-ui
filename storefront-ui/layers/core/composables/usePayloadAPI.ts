export const usePayloadAPI = () => {
  const config = useRuntimeConfig()

  const fetchBanners = async () => {
    try {
      const headers = {}
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

  const fetchCategories = async () => {
    try {
      const headers = {}
      const res = await $fetch(`${config.public.apiBase}/api/category`, {
        method: 'GET',
        headers,
      })
      return res
    } catch (error) {
      console.error('Error fetching categories:', error)
      return null
    }
  }


  const fetchGlobal = async (slug: string, depth: number = 2, draft: boolean = true) => {
    try {
      const headers = {}
      const res = await $fetch(`${config.public.apiBase}/api/globals/${slug}`, {
        method: 'GET',
        headers,
        params: {
          depth: depth,
          draft: draft,
        },
      })
      return res
    } catch (error) {
      console.error(`Error fetching global '${slug}':`, error)
      return null
    }
  }

  return { 
    fetchBanners,  
    fetchCategories,
    fetchGlobal,
  }
}