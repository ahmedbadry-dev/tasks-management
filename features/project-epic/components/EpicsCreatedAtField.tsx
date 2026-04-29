import { CalendarIcon } from '@/shared/components/icons'

type Props = {
  createdAtDate: string
}

export const EpicsCreatedAtField = ({ createdAtDate }: Props) => {
  return (
    <div>
      <h5 className="mb-1 type-label-sm text-slate-400">Created At</h5>
      <div className="field-input flex h-[46px] w-full items-center gap-2 bg-white pl-0">
        <span className="flex h-5 w-5 items-center justify-center">
          <CalendarIcon className="text-primary" size={15} />
        </span>
        <p className="text-xs md:text-sm">{createdAtDate}</p>
      </div>
    </div>
  )
}
