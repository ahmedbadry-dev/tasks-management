import { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & {
    size?: number
}

export const GridIcon = ({
    size = 18,
    className,
    ...props
}: IconProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <path
                d="M0 8V0H8V8H0ZM0 18V10H8V18H0ZM10 8V0H18V8H10ZM10 18V10H18V18H10Z"
                fill="currentColor"
            />
        </svg>
    )
}