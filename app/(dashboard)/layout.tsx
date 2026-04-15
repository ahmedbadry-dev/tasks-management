const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-1 min-h-0 flex-col">
            {children}
        </div>
    )
}

export default layout
