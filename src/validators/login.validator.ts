import {z} from "zod"
export const loginSchema = z.object({
    email: z.string().email("Invalid Email Format").transform((value) => value.toLowerCase()),
    password: z.string().min(2).max(10)
}) 

export type LoginInput = z.infer<typeof loginSchema>