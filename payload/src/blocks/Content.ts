import { Block } from 'payload'

export const Content: Block = {
  slug: 'content',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}