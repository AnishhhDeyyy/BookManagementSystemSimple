import z, { optional } from "zod"
export const updateBookSchema = z.object({
    author: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional()
})

export type updateBookInput = z.infer<typeof updateBookSchema>