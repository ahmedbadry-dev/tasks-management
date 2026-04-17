import { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & {
    size?: number
}

export const ArrowIcon = ({
    size = 16,
    className,
    ...props
}: IconProps) => {
    return (
        <svg width={size} height={size} viewBox="0 0 12 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M10 20L0 10L10 0L11.775 1.775L3.55 10L11.775 18.225L10 20Z" fill="currentColor" />
        </svg>
    )
}


