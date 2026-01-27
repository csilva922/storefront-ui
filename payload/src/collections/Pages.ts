import type { CollectionConfig } from 'payload'
import { Content} from '../blocks/Content'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'slug',
  },
  versions: {
    drafts: true,
    autosave: true,
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { 
        name: 'layout', 
        type:'blocks', 
        minRows: 1,
        blocks:[
            {
                    slug: 'banner',
                    labels: { singular: 'Banner', plural: 'Banners' },
                    fields: [
                        {
                            name: 'banner',
                            type: 'relationship',
                            relationTo: 'banners',
                        },
                    ],
                },
                {
                    slug: 'categories',
                    labels: { singular: 'Category', plural: 'Categories' },
                    fields: [
                        { name: 'heading', type: 'text', defaultValue: 'Shop by Category' },
                        {
                            name: 'items',
                            type: 'relationship',
                            relationTo: 'category',
                            hasMany: true,
                            required: true,
                        },
                    ],
                },
                Content,
        ]
    }
  ],
}
