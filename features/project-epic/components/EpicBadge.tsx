

type EpicBadgeProps = {
    epic_id?: string
}
export const EpicBadge = ({ epic_id }: EpicBadgeProps) => {
    return (
        <div>
            {
                epic_id && (
                    <div className="bg-success px-2 py-1 text-dark-green text-[10px] font-semibold">
                        <p>EPIC-102</p>
                    </div>
                )
            }
        </div>
    )
}
