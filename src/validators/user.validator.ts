import { z } from "zod";

export const userSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email : z.string().trim().email().transform((value) => value.toLowerCase()),
    password: z.string().min(8).max(12),
    phone: z.string().min(10),
    role: z.enum(["USER","ADMIN"])
})

export type RegisterTypeInput = z.infer<typeof userSchema>