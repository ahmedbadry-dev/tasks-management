import { TSignUpSchema } from "@/features/auth/validations/SignUpSchema"
import { FieldError, UseFormRegister } from "react-hook-form"



interface IInputProps {
    name: keyof TSignUpSchema,
    type: string,
    placeholder: string,
    label: string,
    hint?: string,
    register: UseFormRegister<TSignUpSchema>
    error?: FieldError
}

export const Input = ({ name, placeholder, type, label, hint, register, error }: IInputProps) => {
    return (
        <div className="field pb-4">
            <label htmlFor={label} className="field-label">{label}</label>
            <input
                id={label}
                type={type}
                placeholder={placeholder}
                className={`field-input mt-1 ${error ? "is-invalid" : ""}`}
                {...register(name)}
            />
            {hint && !error && <p className="field-hint">{hint}</p>}
            {error && <p className="field-error mt-1">{error.message}</p>}
        </div>
    )
}
