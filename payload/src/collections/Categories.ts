import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'category',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  versions: {
    drafts: true,
    autosave: true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'link', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}