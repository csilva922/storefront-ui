import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
    slug: 'home',
    access: {
        read: () => true,
        update: () => true,
    },
    versions: {
        drafts: true,
        autosave: true,
    },
    admin: {
        livePreview: {
            url: () => {
                const baseURL = process.env.PAYLOAD_PUBLIC_FRONTEND_URL || 'http://localhost:3001'
                return `${baseURL}/preview/global/home`
            },
        },
    },
    fields: [
        {
            name: 'layout',
            label: 'Page Layout',
            type: 'blocks',
            minRows: 1,
            blocks: [
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
            ],
        },
    ],
}