"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { Card } from "@/shared/components/card";
import { Input } from "@/shared/components/input";
import { SignUpSchema, TSignUpSchema } from "../validations/SignUpSchema"
import { signUpAction } from "../actions/signUpAction";
import Link from "next/link";
import { PasswordRequirements } from "./PasswordRequirements";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { routes } from "@/lib/routes";

// import { Loader2 } from "lucide-react"


export const SignUpForm = () => {
    const router = useRouter()

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, watch } = useForm<TSignUpSchema>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            name: "",
            email: "",
            jobTitle: "",
            password: "",
            confirmPassword: ""
        },
        mode: "onBlur"
    })

    const password = watch("password") ?? ""

    const onSubmit: SubmitHandler<TSignUpSchema> = async (data) => {
        const result = await signUpAction(data)

        if (result.ok) {
            toast.success('Account created successfully!')
            router.push(routes.project.list)
        } else {
            toast.error(result.error)
            setError("root", { message: result.error })
        }
    }

    return (
        <div className="w-full sm:w-xl">
            <Card>
                {/* card header */}
                <div className="pb-10 sm:text-center">
                    <h1 className="heading-2">Create your workspace</h1>
                    <p className="type-body-md">Join the editorial approach to task management.</p>
                </div>

                {/* card content */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        register={register}
                        name="name"
                        label="Name"
                        type="text"
                        placeholder="Enter your full name"
                        hint="3-50 characters, letters only."
                        error={errors.name}
                    />
                    <Input
                        register={register}
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="yourname@company.com"
                        error={errors.email}
                    />
                    <Input
                        register={register}
                        name="jobTitle"
                        label="Job Title (Optional)"
                        type="text"
                        placeholder="e.g. Project Manager"
                        error={errors.jobTitle}
                    />

                    <div className="flex flex-col sm:flex-row sm:gap-4">
                        <div className="sm:flex-1">
                            <Input
                                register={register}
                                name="password"
                                label="Password"
                                type="password"
                                placeholder="Minimum 8 characters"
                                error={errors.password}
                            />
                        </div>
                        <div className="sm:flex-1">
                            <Input
                                register={register}
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                placeholder="Repeat your password"
                                error={errors.confirmPassword}
                            />
                        </div>
                    </div>

                    {/* password checklist */}
                    <div className="hidden mb-4 rounded-md sm:block surface-inset">
                        <PasswordRequirements
                            password={password}
                            rules={
                                [
                                    {
                                        label: "At least 8 characters",
                                        met: password.length >= 8
                                    },
                                    {
                                        label: "One uppercase, lowercase, and digit",
                                        met: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
                                    },
                                    {
                                        label: "One special character",
                                        met: /[^a-zA-Z0-9]/.test(password)
                                    },
                                ]
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                {/* card footer */}
                <div className="flex mt-4 justify-center">
                    <p className="type-body-md mr-2">Already have an account?</p>
                    <Link href={routes.auth.signIn} className="type-body-md text-primary">
                        Login
                    </Link>
                </div>
            </Card>
        </div>
    )
}
