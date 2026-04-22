import { cn } from "@/utils/cn"
import { FieldError, UseFormRegister, FieldValues, Path } from "react-hook-form"

interface IInputProps<T extends FieldValues> {
    name: Path<T>,
    type: string,
    placeholder: string,
    register: UseFormRegister<T>
    label?: string,
    hint?: string,
    error?: FieldError
    className?: string
}

export const Input = <T extends FieldValues>({ name, placeholder, type, label, hint, register, error, className }: IInputProps<T>) => {
    const hintId = `${name}-hint`
    const errorId = `${name}-error`
    const describedBy = [hint && !error ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined

    return (
        <div className={cn("field pb-4", className)}>
            {label && <label htmlFor={name} className="field-label">{label}</label>}
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                className={`field-input mt-1 ${error ? "is-invalid" : ""}`}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={describedBy}
                aria-required="true"
                autoComplete={name}
                {...register(name)}
            />
            {hint && !error && (
                <p id={hintId} className="field-hint">{hint}</p>
            )}
            {error && (
                <p id={errorId} role="alert" className="field-error mt-1">
                    {error.message}
                </p>
            )}
        </div>
    )
}