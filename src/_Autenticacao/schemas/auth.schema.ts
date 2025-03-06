import { z } from "zod";

export const authSchema = z.object({
    id: z.string().optional(),
    login: z.string().min(1, "login é indispensável"),
    passwordHash: z.string().min(1, "passwordHash é indispensável"),
    active: z.boolean().default(true)
})

export type AuthSchemaType = z.infer<typeof authSchema>