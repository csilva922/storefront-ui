import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Banners } from './collections/Banners'
import { Categories } from './collections/Categories'
import { Pages } from './collections/Pages'
import { Home } from './globals/Home'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  cors: (process.env.PAYLOAD_PUBLIC_CORS || 'http://localhost:3001').split(','),

  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),

  collections: [
    Users,
    Media,
    Banners,
    Categories,
    Pages,
  ],

  globals: [Home],

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      url: ({ data, collectionConfig, globalConfig }) => {
        const baseURL = process.env.PAYLOAD_PUBLIC_FRONTEND_URL || 'http://localhost:3001'

        if (globalConfig) {
          return `${baseURL}/preview/global/${globalConfig.slug}`
        }

        if (collectionConfig && data?.id) {
          return `${baseURL}/preview/collection/${collectionConfig.slug}/${data.id}`
        }

        return baseURL
      },
      collections: ['banners', 'category', 'pages'],
      globals: ['home'],
    },

  },

  editor: lexicalEditor(),

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  sharp,
  plugins: [],

  localization: {
    locales: ['en'],
    defaultLocale: 'en',
  },
})
