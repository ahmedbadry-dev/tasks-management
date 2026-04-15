"use client";

import { Card } from '@/shared/components/card'
import { Input } from '@/shared/components/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { signInAction } from '../actions/signInAction';
import Link from 'next/link';
import { ForgetPasswordSchema, TForgetPasswordSchema } from '../validations/ForgetPasswordSchema';
import { ArrowLeftIcon, CheckCircleIcon, TimerIcon } from '@/shared/components/icons';





export const ForgetPasswordForm = () => {

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<TForgetPasswordSchema>({
        resolver: zodResolver(ForgetPasswordSchema),
        defaultValues: {
            email: '',
        },
        mode: 'onBlur'
    })


    const onSubmit: SubmitHandler<TForgetPasswordSchema> = async (data) => {

        console.log(data)
    }
    return (
        <div className="w-full sm:w-120">
            <div className='bg-background rounded-lg px-6 sm:p-8 shadow-card'>
                {/* card header */}
                <div className="pb-10 text-center sm:text-start">
                    <h1 className="heading-2">Forgot password?</h1>
                    <p className="type-body-md">No worries, we'll send you reset instructions.</p>
                </div>

                {/* card content */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        register={register}
                        name="email"
                        label="Email address"
                        type="text"
                        placeholder="Enter your email"
                        error={errors.email}
                    />

                    {errors.root?.message && (
                        <p className="text-sm text-red-500 mb-4">{errors.root.message}</p>
                    )}
                    {/* Remember Me */}

                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    <Link
                        href='/sign-in'
                        className="btn btn-ghost w-full py-6 flex justify-center items-center gap-2 "
                    >
                        <ArrowLeftIcon size={12} className='text-primary' />
                        <span className='type-body-md text-primary'>Back to log in</span>
                    </Link>
                </form>

                {/* card footer only on desktop */}
                <div className="hidden mt-4 sm:flex flex-col gap-6">

                    <div className='flex flex-col p-4 gap-2 bg-success/20 rounded-lg '>
                        {/* sending message */}
                        <div className='flex gap-2'>
                            <div>
                                <CheckCircleIcon size={25} />
                            </div>
                            <p className='type-body-md text-dark-green'>If an account exists with this email, we've sent a password reset link.</p>
                        </div>

                    </div>
                    {/* resend trimer  only on desktop*/}
                    <div className='hidden flex-col gap-3  sm:flex'>
                        <p className='text-center'>Didn't receive the email?</p>
                        <div className='flex justify-center gap-2 p-4 text-slate-400 bg-slate-200/20 rounded-lg'>
                            <TimerIcon />
                            <p>Resend in <span>05:00</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* sending message only on mobile*/}
            <div className='flex flex-col p-4 mt-6 gap-2 bg-success/20 rounded-lg sm:hidden'>
                {/* sending message */}
                <div className='flex gap-2 border-b border-slate-200 pb-4'>
                    <div>
                        <CheckCircleIcon size={25} />
                    </div>
                    <p className='type-body-md text-dark-green'>If an account exists with this email, we've sent a password reset link.</p>
                </div>

                {/* resend trimer  only on mobile */}
                <div className='flex justify-between items-center pt-1'>
                    <p className='type-label-sm text-slate-400'>Didn't receive email?</p>
                    <p className='type-label-sm text-primary'>Resend in <span>05:00</span></p>
                </div>
            </div>
        </div>
    )
}
