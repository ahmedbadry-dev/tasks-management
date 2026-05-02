"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { Card } from "@/shared/components/card";
import { Input } from "@/shared/components/input";
import { PasswordRequirements } from "./PasswordRequirements";
import { CreateNewPasswordSchema, TCreateNewPasswordSchema } from "../validations/CreateNewPasswordSchema";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { Spinner } from "@/shared/components/Spinner";



export const CreateNewPasswordForm = () => {

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, watch } = useForm<TCreateNewPasswordSchema>({
        resolver: zodResolver(CreateNewPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
        mode: "onBlur"
    })

    const password = watch("password") ?? ""

    const onSubmit: SubmitHandler<TCreateNewPasswordSchema> = async (data) => {
        console.log(data)
    }

    return (
        <div className="w-full sm:w-125">
            <Card>
                {/* card header */}
                <div className="pb-10 text-center sm:text-start">
                    <h1 className="heading-2 pb-2">Create your workspace</h1>
                    <p className="type-body-md">Create a new, strong password to secure your workstation access.</p>
                </div>

                {/* card content */}
                <form onSubmit={handleSubmit(onSubmit)}>

                    <Input
                        register={register}
                        name="password"
                        label="New Password"
                        type="password"
                        placeholder="Enter New Password"
                        error={errors.password}
                    />

                    <Input
                        register={register}
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        placeholder="Repeat your password"
                        error={errors.confirmPassword}
                    />


                    {/* password checklist */}
                    <div className="mb-4 rounded-md sm:flex gap-4 flex-col surface-inset ">
                        <p className="pb-2 mb-2 sm:mb-0 sm:border-b border-slate-900/10">Security Requirements</p>
                        <PasswordRequirements
                            password={password}
                            rules={
                                [
                                    {
                                        label: "8-64 characters",
                                        met: password.length >= 8 && password.length <= 64
                                    },
                                    {
                                        label: "One uppercase",
                                        met: /[A-Z]/.test(password)
                                    },
                                    {
                                        label: "Special character",
                                        met: /[^a-zA-Z0-9]/.test(password)
                                    },
                                    {
                                        label: "Lowercase letter",
                                        met: /[a-z]/.test(password)
                                    },
                                    {
                                        label: "One digit",
                                        met: /[0-9]/.test(password)
                                    }
                                ]
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="inline-flex items-center gap-2">
                                <Spinner size="sm" label="Updating password" className="border-white/40 border-t-white" />
                                <span>Update Password</span>
                            </span>
                        ) : "Update Password"}
                    </button>
                </form>

                {/* card footer */}
                <div className="flex mt-4 justify-center">
                    <Link href={routes.auth.signIn} className="type-body-md text-primary">
                        Back to sign in
                    </Link>
                </div>
            </Card>
        </div>
    )
}
