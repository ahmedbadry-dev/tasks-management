import { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & {
    size?: number
}

export const ArrowLeftIcon = ({
    size = 16,
    className,
    ...props
}: IconProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <path
                d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z"
                fill="currentColor"
            />
        </svg>
    )
}