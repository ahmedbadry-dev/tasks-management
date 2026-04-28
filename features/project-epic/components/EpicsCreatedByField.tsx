import { MemberAvatar } from '@/features/project-members/components/MemberAvatar'

type Props = {
  createdByName: string
}

export const EpicsCreatedByField = ({ createdByName }: Props) => {
  return (
    <div>
      <h5 className="mb-1 type-label-sm text-slate-400">Created By</h5>
      <div className="field-input flex w-full items-center gap-2 bg-white pl-0">
        <MemberAvatar name={createdByName} size={8} textSize={12} />
        <p className="text-xs md:text-sm">{createdByName}</p>
      </div>
    </div>
  )
}
