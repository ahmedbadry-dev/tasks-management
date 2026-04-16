import { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & {
    size?: number
}

export const MenuIcon = ({
    size = 18,
    className,
    ...props
}: IconProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 18 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <path
                d="M0 12V10H18V12H0ZM0 7V5H18V7H0ZM0 2V0H18V2H0Z"
                fill="currentColor"
            />
        </svg>
    )
}