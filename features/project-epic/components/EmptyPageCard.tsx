
type EmptyPageCardProps = {
    icon: React.ReactNode
    title: string
    body: string
}


export const EmptyPageCard = ({ title, body, icon }: EmptyPageCardProps) => {
    return (
        <div className="w-52 rounded-lg bg-surface-low p-4  text-start">
            <div className="inline-flex bg-white p-2 mb-3 rounded-md">
                {icon}
            </div>
            <h3 className="type-body-md mb-1 font-semibold">
                {title}
            </h3>
            <p className="text-slate-400 text-[12px]">{body}</p>
        </div>
    )
}
