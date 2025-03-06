import { z } from "zod";


export const ExternalAuthSchema = z.object({
    external_id: z.string().min(1, "external_id é indispensável"),
    authentication_id: z.string().min(1, "authentication_id é indispensável"),
    email: z.string().min(1, "email é indispensável"),
    provider: z.string().min(1, "provider é indispensável"),
})

export type ExternalAuthSchemaType = z.infer<typeof ExternalAuthSchema>