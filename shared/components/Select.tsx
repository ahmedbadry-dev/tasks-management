import { cn } from "@/utils/cn"
import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form"
import { ArrowIcon } from "@/shared/components/icons"

type TSelectOption = {
    label: string
    value: string
}

interface ISelectProps<T extends FieldValues> {
    name: Path<T>
    register: UseFormRegister<T>
    options: TSelectOption[]
    label?: string
    error?: FieldError
    placeholder?: string
    className?: string
}

export const Select = <T extends FieldValues>({
    name,
    register,
    options,
    label,
    error,
    placeholder,
    className,
}: ISelectProps<T>) => {
    const hintId = `${name}-hint`
    const errorId = `${name}-error`
    const describedBy = error ? errorId : undefined

    return (
        <div className={cn("field pb-4", className)}>
            {label && (
                <label htmlFor={name} className="field-label">
                    {label}
                </label>
            )}
            <div className="relative mt-1">
                <select
                    id={name}
                    className={cn(
                        "field-input appearance-none pr-10 cursor-pointer",
                        error && "is-invalid"
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={describedBy}
                    {...register(name)}
                >
                    {placeholder && (
                        <option value="" disabled className="text-muted">
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-background text-foreground py-2"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <ArrowIcon className="text-muted-foreground transition-transform rotate-270" size={10} />
                </div>
            </div>

            {error && (
                <p id={errorId} role="alert" className="field-error mt-1">
                    {error.message}
                </p>
            )}
        </div>
    )
}