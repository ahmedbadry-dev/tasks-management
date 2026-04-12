import { Card } from "@/shared/components/Card"
import { Input } from "@/shared/components/Input"

export const SignUpForm = () => {
    return (
        <div className="w-full sm:w-xl">
            <Card>
                {/* card header */}
                <div className="pb-10 sm:text-center">
                    <h1 className="heading-2">Create your workspace</h1>
                    <p className="type-body-md">Join the editorial approach to task management.</p>
                </div>
                {/* card content */}
                <form>
                    {/* input field */}
                    <Input
                        name="name"
                        label="name"
                        type="text"
                        placeholder="Enter your full name"
                        hint="3-50 characters, letters only."
                    />
                    <Input
                        name="email"
                        label="email"
                        type="text"
                        placeholder="yourname@company.com"
                    />
                    <Input
                        name="jopTitle"
                        label="Job Title (Optional)"
                        type="text"
                        placeholder="e.g. Project Manager"
                    />
                    <div className="flex flex-col sm:flex-row sm:gap-4">
                        <div className="sm:flex-1">
                            <Input
                                name="Password"
                                label="Password"
                                type="password"
                                placeholder="Minimum 8 characters"
                            />
                        </div>
                        <div className="sm:flex-1">
                            <Input
                                name="Confirm Password"
                                label="Confirm Password"
                                type="password"
                                placeholder="Repeat your password"
                            />
                        </div>
                    </div>

                    {/* password check list  */}
                    <div className="hidden mb-4 rounded-md sm:block surface-inset">
                        soon
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                    >
                        Create Account
                    </button>
                </form>
                {/* card footer */}
                <div className="flex mt-4 justify-center">
                    <p className="type-body-md mr-2">Already have an account?</p>
                    <button className="type-body-md text-primary">Login</button>
                </div>
            </Card>
        </div>
    )
}
