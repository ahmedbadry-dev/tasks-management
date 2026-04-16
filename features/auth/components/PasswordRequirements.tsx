import clsx from "clsx"

type rule = {
    label: string,
    met: boolean
}

type PasswordRequirementsProps = {
    password: string,
    rules: rule[]
}

export const PasswordRequirements = ({ password, rules }: PasswordRequirementsProps) => {
    // const { watch } = useFormContext()
    // const password = watch(pass) ?? ""



    return (
        <div className="flex flex-col flex-wrap gap-2 sm:max-h-23">
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

