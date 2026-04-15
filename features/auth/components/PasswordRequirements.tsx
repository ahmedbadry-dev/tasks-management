import clsx from "clsx"
import { useFormContext } from "react-hook-form"

export const PasswordRequirements = ({ password }: { password: string }) => {
    // const { watch } = useFormContext()
    // const password = watch(pass) ?? ""

    const rules = [
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

    return (
        <div className="flex flex-col gap-2">
            {rules.map((rule) => (
                <div key={rule.label} className="flex items-center gap-2">

                    {/* circle */}
                    <div className={clsx("w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-200 ",
                        rule.met ? "text-dark-green" : "text-slate-600"
                    )}
                    >
                        {
                            rule.met
                                ? <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                                    <path
                                        d="M2 5l2.5 2.5L8 3"
                                        stroke={rule.met && '#004E32'}
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                : null
                        }
                    </div>

                    {/* text */}
                    <span className={`heading-3 transition-colors duration-200 text-slate-600`}
                    >
                        {rule.label}
                    </span>

                </div>
            ))}
        </div>
    )
}

