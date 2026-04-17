import { z } from 'zod'

const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name must be at most 50 characters')
      .regex(/^[\p{L}]+(?:\s[\p{L}]+)*$/u, {
        message:
          'Name can only contain letters and single spaces between names',
      }),
    email: z.email('Invalid email address').min(1, 'Email is required'),
    jobTitle: z
      .string()
      .min(2, 'Job title must be at least 2 characters')
      .max(50, 'Job title must be at most 50 characters')
      .regex(/^[\p{L}\s\-&/,.]+$/u, 'Job title contains invalid characters')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password must be at most 64 characters')
      .regex(/^\S+$/, 'Password must not contain spaces')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one digit')
      .regex(
        /[^a-zA-Z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type TSignUpSchema = z.infer<typeof SignUpSchema>

export { SignUpSchema, type TSignUpSchema }
