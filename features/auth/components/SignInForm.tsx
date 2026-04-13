"use client";

import { Card } from '@/shared/components/card'
import { Input } from '@/shared/components/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInSchema, TSignInSchema } from '../validations/SignInSchema'
import { useForm, SubmitHandler } from 'react-hook-form'



export const SignInForm = () => {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(SignInSchema)
    })

    const onSubmit: SubmitHandler<TSignInSchema> = (data) => {
        console.log(data)
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
                    {/* Remember Me */}

                    <div className='flex justify-between py-4'>
                        <div>
                            <input
                                id='remember-me'
                                type='checkbox'
                                {...register("rememberMe")}
                            />
                            <label htmlFor="remember-me" className='ml-2 cursor-pointer'>Remember Me</label>
                        </div>
                        <p>Forgot Password?</p>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "LogIn..." : "LogIn"}
                    </button>
                </form>

                {/* card footer */}
                <div className="flex mt-4 justify-center">
                    <p className="type-body-md mr-2">Don't have an account? ?</p>
                    <button className="type-body-md text-primary">Sign Up</button>
                </div>
            </Card>
        </div>
    )
}
