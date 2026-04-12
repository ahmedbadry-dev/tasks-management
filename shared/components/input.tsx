


interface IInputProps {
    name: string,
    type: string,
    placeholder: string,
    label: string,
    hint?: string
}

export const Input = ({ name, placeholder, type, label, hint }: IInputProps) => {
    return (
        <div className="field pb-4">
            <label htmlFor={label} className="field-label">{label}</label>
            <input
                id={label}
                type={type}
                placeholder={placeholder}
                className="field-input"
            />
            {
                hint && <p className="field-hint">{hint}</p>
            }
        </div>
    )
}
