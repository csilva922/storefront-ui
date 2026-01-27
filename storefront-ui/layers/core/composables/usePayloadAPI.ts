export const usePayloadAPI = () => {
  const config = useRuntimeConfig()
  const route = useRoute()

  const fetchByID = async (collection: string, id: string | number, draft = false, depth = 0,) => {
    const headers = {}
    return await $fetch(`${config.public.apiBase}/api/${collection}/${id}`, {
      method: 'GET',
      headers,
      query: {
        draft,
        depth
      },
    })
  }

  const fetchBySlug = async (collection: string, slug: string,
    draft = false, depth = 0) => {
    const res = await $fetch<{ docs?: any[] }>(`${config.public.apiBase}/api/${collection}`, {
      method: "GET",
      query: {
        "where[slug][equals]": slug,
        limit: "1",
        draft: draft ? "true" : "false",
        depth: String(depth),
      },
    });

    return res?.docs?.[0] ?? null;
  };

  const fetchGlobal = async (
    globalSlug: string,
    draft = false,
    depth = 0
  ) => {
    return await $fetch(`${config.public.apiBase}/api/globals/${globalSlug}`, {
      method: 'GET',
      query: {
        draft: draft ? 'true' : 'false',
        depth: String(depth),
      },
    })
  }

  const fetchList = async (
    collection: string,
    draft = false,
    depth = 0,
    limit = 10,
    page = 1
  ) => {
    return await $fetch(`${config.public.apiBase}/api/${collection}`, {
      method: 'GET',
      query: {
        draft: draft ? 'true' : 'false',
        depth: String(depth),
        limit: String(limit),
        page: String(page),
      },
    })
  }

  return { fetchByID, fetchBySlug, fetchGlobal, fetchList }

}