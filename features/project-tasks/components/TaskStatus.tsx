import { cn } from "@/utils/cn"

type Props = {
    status: string
}
export const TaskStatus = ({ status }: Props) => {
    return (
        <div className={cn("bg-surface-highest px-2 py-1 text-[10px] font-semibold",
            status === 'DONE' && 'bg-success',
            status === 'BLOCKED' && 'bg-error/30 text-error'
        )}>
            <p>{status}</p>
        </div>
    )
}



