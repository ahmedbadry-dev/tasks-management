import { useState } from 'react'
import { FieldError, Path, UseFormRegister } from 'react-hook-form'
import { TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type TextareaProps<T extends Record<string, unknown>> = {
    name: Path<T>
    label?: string
    register: UseFormRegister<T>
    error?: FieldError
    hint?: string
    maxLength?: number
    required?: boolean
    className?: string
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>

export const Textarea = <T extends Record<string, unknown>>({
    name,
    label,
    register,
    error,
    hint,
    maxLength,
    required = false,
    className,
    ...rest
}: TextareaProps<T>) => {
    const [count, setCount] = useState(0)

    const hintId = `${name}-hint`
    const errorId = `${name}-error`
    const describedBy = error ? errorId : hint ? hintId : undefined

    return (
        <div className={cn("field pb-4 ", className)}>
            <div className='flex justify-between'>
                {label && <label htmlFor={name} className="field-label">
                    {label}
                </label>}
                {/* hint */}
                {hint && <p id={hintId} className="field-hint">
                    {hint}
                </p>}
            </div>
            <textarea
                id={name}
                maxLength={maxLength}
                className={`field-input mt-1 resize-none ${error ? 'is-invalid' : ''}`}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={describedBy}
                aria-required={required ? 'true' : 'false'}
                {...register(name, {
                    onChange: (e) => setCount(e.target.value.length),
                })}
                {...rest}
            />
            <div className="flex justify-between items-center">
                {/* error */}
                {
                    error ? (
                        <p id={errorId} role="alert" className="field-error mt-1">
                            {error.message}
                        </p>
                    ) : <span></span>
                }
                {/* 0 / 500 */}
                {maxLength && (
                    <p className={`text-xs mt-1 justify-self-end ${count >= maxLength ? 'text-red-500' : 'text-slate-400'}`}>
                        {count}/{maxLength}
                    </p>
                )}
            </div>
        </div>
    )
}

