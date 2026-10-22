import z, { email } from "zod";

export const updateUserSchema = z.object({
    name: z.string().trim().min(2).max(100).optional(),
    email: z.string().trim().min(2).max(100).email().transform((value)=>value.toLowerCase()).optional(),

}).refine(
    (data) => data.name !== undefined || data.email !== undefined,
    {
        message: "At least one field (name or email) must be provided"
    }
)

export type UpdateUserInput = z.infer<typeof updateUserSchema>