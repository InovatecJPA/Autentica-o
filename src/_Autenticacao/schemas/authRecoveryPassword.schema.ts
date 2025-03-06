import {z} from 'zod'

export const AuthRecoveryPasswordSchema = z.object({
    authenticationId: z.string().min(1, "authenticationId é necessário"),
    token: z.string().min(1, "token é necessário"),
    expirationDate: z.date(),
})

export type AuthenticationRecoveryPasswordSchemaType = z.infer<typeof AuthRecoveryPasswordSchema>