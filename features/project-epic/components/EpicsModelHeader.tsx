import { CloseIcon, ColumnsIcon } from '@/shared/components/icons'
import { EpicsInlineTitleField } from './EpicsInlineTitleField'

type Props = {
  dialogTitleId: string
  epicId: string | null
  projectId: string | null
  epicCode: string
  epicTitle: string
  onClose: () => void
}

export const EpicsModelHeader = ({
  dialogTitleId,
  epicId,
  projectId,
  epicCode,
  epicTitle,
  onClose,
}: Props) => {
  return (
    <div className="mb-5 flex items-start justify-between">
      <div className="min-w-0 flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex">
            <ColumnsIcon className="text-primary" />
          </span>
          <span>{epicCode}</span>
        </div>
        <h2 className="min-w-0 pr-2">
          {epicId ? (
            <EpicsInlineTitleField
              key={epicId}
              epicId={epicId}
              projectId={projectId ?? ''}
              initialTitle={epicTitle}
              variant="header"
              headingId={dialogTitleId}
            />
          ) : (
            <>
              <span id={dialogTitleId} className="heading-2 hidden break-words whitespace-normal md:block">
                {epicTitle}
              </span>
              <span className="heading-3 break-words whitespace-normal md:hidden">
                {epicTitle}
              </span>
            </>
          )}
        </h2>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-slate-200 p-2 px-3 text-sm text-slate-600 hover:bg-slate-50"
          aria-label="Close epic details modal"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}
