import { z, defineCollection } from 'astro:content';

const book = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    coverTitle: z.string(),
    pages: z.array(
      z.object({
        type: z.enum(['text', 'image']),
        title: z.string().optional(),
        content: z.string().optional(),
        imageSrc: image().optional(),
        imageAlt: z.string().optional()
      })
    )
  })
});

export const collections = { book };
