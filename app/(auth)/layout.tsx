const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-1 items-center justify-center bg-background px-4 py-6 sm:px-6">
            {children}
        </div>
    )
}

export default layout
