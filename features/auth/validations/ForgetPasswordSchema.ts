import { z } from 'zod'

const ForgetPasswordSchema = z.object({
  email: z.email('Invalid email address').min(1, 'Email is required'),
})

type TForgetPasswordSchema = z.infer<typeof ForgetPasswordSchema>

export { ForgetPasswordSchema, type TForgetPasswordSchema }
