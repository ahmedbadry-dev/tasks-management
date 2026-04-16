"use client";

import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react';
import { Input } from '@/shared/components/input'
import { ForgetPasswordSchema, TForgetPasswordSchema } from '../validations/ForgetPasswordSchema';
import { ArrowLeftIcon, CheckCircleIcon, TimerIcon } from '@/shared/components/icons';
import { forgotPasswordAction } from '../actions/forgotPasswordAction';
import Link from 'next/link';
import clsx from 'clsx';

const RESEND_TRIALS_KEY = 'forgot_password_resend_trials'
const RESEND_TIMER_KEY = 'forgot_password_resend_timer_end'
const INITIAL_RESEND_TRIALS = 3
const RESEND_TIMER_DURATION = 300 // 5 minutes

export const ForgetPasswordForm = () => {

    const [isEmailSent, setIsEmailSent] = useState(false)
    const [timeLeft, setTimeLeft] = useState(0)
    const [resendTrials, setResendTrials] = useState(INITIAL_RESEND_TRIALS)
    const [isInitialized, setIsInitialized] = useState(false)

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, clearErrors, getValues } = useForm<TForgetPasswordSchema>({
        resolver: zodResolver(ForgetPasswordSchema),
        defaultValues: { email: '' },
        mode: 'onBlur'
    })

    // restore state from localStorage on mount
    useEffect(() => {
        const storedTrials = localStorage.getItem(RESEND_TRIALS_KEY)
        const storedTimerEnd = localStorage.getItem(RESEND_TIMER_KEY)

        if (storedTrials !== null) {
            setResendTrials(parseInt(storedTrials))
        }

        if (storedTimerEnd !== null) {
            const remaining = Math.round((parseInt(storedTimerEnd) - Date.now()) / 1000)
            if (remaining > 0) {
                setIsEmailSent(true)
                setTimeLeft(remaining)
            } else {
                localStorage.removeItem(RESEND_TIMER_KEY)
            }
        }

        setIsInitialized(true)
    }, [])

    // countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    localStorage.removeItem(RESEND_TIMER_KEY)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [timeLeft])

    const startTimer = (duration: number) => {
        const endTime = Date.now() + duration * 1000
        localStorage.setItem(RESEND_TIMER_KEY, String(endTime))
        setTimeLeft(duration)
    }

    const handleForgotPassword = async (data: TForgetPasswordSchema) => {
        clearErrors("root")

        const result = await forgotPasswordAction(data)

        if (result.status === 'sent') {
            setIsEmailSent(true)
            startTimer(RESEND_TIMER_DURATION)
            return
        }

        if (result.status === 'rate_limited') {
            setIsEmailSent(true)
            startTimer(result.retryAfter)
            return
        }

        if (result.status === 'blocked') {
            setResendTrials(0)
            localStorage.setItem(RESEND_TRIALS_KEY, '0')
            setError("root", { message: "You've exceeded the maximum attempts. Please try again later." })
            return
        }

        setError("root", { message: result.error })
    }

    // first submit — Send Reset Link button
    const onSubmit: SubmitHandler<TForgetPasswordSchema> = async (data) => {
        await handleForgotPassword(data)
    }

    // resend — uses current email value from form
    const onResend = async () => {
        if (timeLeft > 0 || resendTrials <= 0) return

        const newTrials = resendTrials - 1
        setResendTrials(newTrials)
        localStorage.setItem(RESEND_TRIALS_KEY, String(newTrials))

        await handleForgotPassword({ email: getValues('email') })
    }

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0")
    const seconds = String(timeLeft % 60).padStart(2, "0")

    const isResendDisabled = timeLeft > 0 || resendTrials <= 0

    if (!isInitialized) return null

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

                    {/* Send Reset Link — disabled after first send */}
                    <button
                        type="submit"
                        className={clsx("btn btn-primary w-full mt-2",
                            (isSubmitting || isEmailSent) && "cursor-not-allowed opacity-80"
                        )}
                        disabled={isSubmitting || isEmailSent}
                    >
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </button>

                    <Link
                        href='/sign-in'
                        className="btn btn-ghost w-full py-6 flex justify-center items-center gap-2"
                    >
                        <ArrowLeftIcon size={12} className='text-primary' />
                        <span className='type-body-md text-primary'>Back to log in</span>
                    </Link>
                </form>

                {/* Success + Resend — desktop */}
                {isEmailSent && (
                    <div className="hidden mt-4 sm:flex flex-col gap-6">
                        <div className='flex flex-col p-4 gap-2 bg-success/20 rounded-lg'>
                            <div className='flex gap-2'>
                                <div>
                                    <CheckCircleIcon size={25} />
                                </div>
                                <p className='type-body-md text-dark-green'>
                                    If an account exists with this email, we've sent a password reset link.
                                </p>
                            </div>
                        </div>

                        <div className='hidden flex-col gap-3 sm:flex'>
                            <p className='text-center'>Didn't receive the email?</p>

                            {timeLeft > 0 ? (
                                <div className='flex justify-center gap-2 p-4 text-slate-400 bg-slate-200/20 rounded-lg'>
                                    <TimerIcon />
                                    <p>Resend in <span>{minutes}:{seconds}</span></p>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={onResend}
                                    disabled={isResendDisabled}
                                    className={clsx("btn btn-ghost w-full",
                                        isResendDisabled && "cursor-not-allowed opacity-50"
                                    )}
                                >
                                    Resend Email
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Success + Resend — mobile */}
            {isEmailSent && (
                <div className='flex flex-col p-4 mt-6 gap-2 bg-success/20 rounded-lg sm:hidden'>
                    <div className='flex gap-2 border-b border-slate-200 pb-4'>
                        <div>
                            <CheckCircleIcon size={25} />
                        </div>
                        <p className='type-body-md text-dark-green'>
                            If an account exists with this email, we've sent a password reset link.
                        </p>
                    </div>

                    <div className='flex justify-between items-center pt-1'>
                        <p className='type-label-sm text-slate-400'>Didn't receive email?</p>
                        {timeLeft > 0 ? (
                            <p className='type-label-sm text-primary'>
                                Resend in <span>{minutes}:{seconds}</span>
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={onResend}
                                disabled={isResendDisabled}
                                className={clsx("type-label-sm text-primary",
                                    isResendDisabled && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                Resend
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}