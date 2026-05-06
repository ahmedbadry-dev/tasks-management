"use client";

import { Card } from '@/shared/components/card'
import { Input } from '@/shared/components/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInSchema, TSignInSchema } from '../validations/SignInSchema'
import { useForm, SubmitHandler } from 'react-hook-form'
import { signInAction } from '../actions/signInAction';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { routes } from '@/lib/routes';
import { Spinner } from '@/shared/components/Spinner';





type SignInFormProps = {
    redirectTo?: string
}

const sanitizeRedirectTo = (redirectTo?: string) => {
    if (!redirectTo) return null
    if (!redirectTo.startsWith('/')) return null
    if (redirectTo.startsWith('//')) return null
    return redirectTo
}

export const SignInForm = ({ redirectTo }: SignInFormProps) => {
    const router = useRouter()
    const safeRedirectTo = sanitizeRedirectTo(redirectTo)

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<TSignInSchema>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        mode: 'onBlur'
    })


    const onSubmit: SubmitHandler<TSignInSchema> = async (data) => {
        const result = await signInAction(data)

        if (result.ok) {
            toast.success('Welcome back!')
            router.push(safeRedirectTo ?? routes.project.list)
        } else {
            toast.error(result.error)
            setError('root', { message: result.error })
        }
    }
    return (
        <div className="w-full sm:w-120">
            <Card>
                {/* card header */}
                <div className="pb-10 sm:text-center">
                    <h1 className="heading-2">Welcome Back</h1>
                    <p className="type-body-md">Please enter your details to access your workspace</p>
                </div>

                {/* card content */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        register={register}
                        name="email"
                        label="email"
                        type="text"
                        placeholder="yourname@company.com"
                        error={errors.email}
                    />
                    <Input
                        register={register}
                        name="password"
                        label="password"
                        type="password"
                        placeholder="Enter your password"
                        error={errors.password}
                    />
                    {errors.root?.message && (
                        <p className="text-sm text-red-500 mb-4">{errors.root.message}</p>
                    )}
                    {/* Remember Me */}

                    <div className='flex justify-between py-4'>
                        <div className='flex justify-center items-center'>
                            <input
                                id='remember-me'
                                type='checkbox'
                                {...register("rememberMe")}
                            />
                            <label htmlFor="remember-me" className='ml-2 cursor-pointer'>Remember Me</label>
                        </div>

                        <Link href={routes.auth.forgetPassword} className="type-body-md text-primary">
                            Forgot Password?
                        </Link>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="inline-flex items-center gap-2">
                                <Spinner size="sm" label="Logging in" className="border-white/40 border-t-white" />
                                <span>LogIn</span>
                            </span>
                        ) : 'LogIn'}
                    </button>
                </form>

                {/* card footer */}
                <div className="flex mt-4 justify-center">
                    <p className="type-body-md mr-2">Don&apos;t have an account?</p>
                    <Link href={routes.auth.signUp} className="type-body-md text-primary">
                        Sign Up
                    </Link>
                </div>
            </Card>
        </div>
    )
}
