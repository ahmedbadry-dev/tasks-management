
export const Header = ({ children }: { children: React.ReactNode }) => {
    return (
        <header className="flex justify-between items-center px-10 h-16 border border-b-0.5 border-black/10">
            {children}
        </header>
    )
}
