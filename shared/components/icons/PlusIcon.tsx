import { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & {
    size?: number
}

export const PlusIcon = ({
    size = 11,
    className,
    ...props
}: IconProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <path
                d="M4.5 6H0V4.5H4.5V0H6V4.5H10.5V6H6V10.5H4.5V6Z"
                fill="currentColor"
            />
        </svg>
    )
}