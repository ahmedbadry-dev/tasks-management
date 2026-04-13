import { z } from 'zod'

const SignInSchema = z.object({
  email: z.email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
})

type TSignInSchema = z.infer<typeof SignInSchema>

export { SignInSchema, type TSignInSchema }
