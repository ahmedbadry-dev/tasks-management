
const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-full">
            <h1>header</h1>
            {children}
        </div>
    )
}

export default layout
