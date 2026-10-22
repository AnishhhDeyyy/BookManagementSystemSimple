import {z} from 'zod';
export const createBookSchema =  z.object({
    title: z.string().min(1).max(10),
    author: z.string().min(1).max(10),
    description: z.string().min(1).max(10).optional(),
    publishedAt: z.coerce.date().optional()
})

export type createBookInput = z.infer<typeof createBookSchema>