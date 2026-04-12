
export const Card = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className=" bg-background rounded-lg px-6 sm:p-8 sm:shadow-card">
            {children}
        </div>
    )
}
