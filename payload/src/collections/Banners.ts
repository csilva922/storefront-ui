import type { CollectionConfig } from 'payload'

export const Banners: CollectionConfig = {
  slug: 'banners',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'internalName',
  },
  versions: {
    drafts: true,
    autosave: true,
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
