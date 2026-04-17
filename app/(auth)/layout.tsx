import { Logo } from "@/shared/components/Logo"

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col flex-1 ">
            <div className="flex justify-start px-10 h-16">
                <Logo />
            </div>
            <div className=" flex flex-1 items-center justify-center bg-background px-4 py-6 sm:px-6">
                {children}
            </div>
        </div>

    )
}

export default layout
