import type { CollectionConfig } from 'payload'

export const Banners: CollectionConfig = {
  slug: 'banners',
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
    autosave: true,
  },
  admin: {
    useAsTitle: 'internalName',
    livePreview: {
      url: ({ data }) => `http://localhost:3001/preview/collection/banners/${data.id}`,
    },
  },
  fields: [
    { name: 'internalName', type: 'text', required: true },
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'text' },
    { name: 'buttonText', type: 'text' },
    { name: 'buttonLink', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
