"use client";


import { Input } from '@/shared/components/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Textarea } from '@/shared/components/Textarea';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@/shared/components/Select';
import { addTaskSchema, TAddTaskSchema } from '../validations/addTaskSchema';
import { toast } from 'sonner';
import { routes } from '@/lib/routes';
import { TEpic, TMember } from '@/features/project-epic/types';
import { addNewTaskAction } from '../actions/addNewTaskAction';
import { TASK_STATUS_OPTIONS } from '../constants';
import { Spinner } from '@/shared/components/Spinner';

type TAddNewTaskFormProps = {
    projectId: string
    members: TMember[]
    epics: TEpic[]
    epicId?: string
    status?: string
}

type TaskStatus = TAddTaskSchema['status']

const isTaskStatus = (value: string): value is TaskStatus =>
    TASK_STATUS_OPTIONS.some((option) => option.value === value)



export const AddNewTaskForm = ({
    members = [],
    projectId,
    epics = [],
    epicId,
    status,
}: TAddNewTaskFormProps) => {
    const [isCanceling, setIsCanceling] = useState(false)
    const router = useRouter()
    const normalizedStatus: TaskStatus =
        status && isTaskStatus(status)
            ? status
            : 'TO_DO'

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, clearErrors } = useForm<TAddTaskSchema>({
        resolver: zodResolver(addTaskSchema),
        defaultValues: {
            project_id: projectId,
            title: '',
            epic_id: epicId ?? undefined,
            description: '',
            assignee_id: '',
            due_date: '',
            status: normalizedStatus,
        },
        mode: 'onBlur'
    })



    const onSubmit: SubmitHandler<TAddTaskSchema> = async (data) => {
        clearErrors('root')

        const result = await addNewTaskAction({
            project_id: projectId,
            title: data.title,
            status: data.status,
            epic_id: data.epic_id || null,
            description: data.description || null,
            assignee_id: data.assignee_id || null,
            due_date: data.due_date || null,
        })

        if (result.ok) {
            toast.success('Task created successfully!')
            router.push(routes.project.tasks(projectId))
        } else {
            toast.error(result.error)
            setError('root', { message: result.error })
        }
    }


    const handleCancel = () => {
        setIsCanceling(true)
        router.back()
    }


    return (
        <div className="w-full sm:w-2xl">
            <div className=" bg-background rounded-lg sm:shadow-card mb-20">
                <div className=' px-6 sm:p-8 '>

                    {/* card content */}
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <Input
                            register={register}
                            name="title"
                            type="text"
                            placeholder="e.g., Finalize structural schematics"
                            error={errors.title}
                            className='flex-1'
                            label='title'
                        />

                        <div className='flex flex-col sm:flex-row sm:gap-4'>
                            <Select
                                register={register}
                                name='status'
                                options={TASK_STATUS_OPTIONS}
                                className='flex-1'
                                error={errors.status}
                                label='Assignee'
                                placeholder='TO DO'
                            />
                            <Select
                                register={register}
                                name='assignee_id'
                                options={members.map((member) => ({
                                    label: member.metadata.name,
                                    value: member.user_id
                                }))}
                                className='flex-1'
                                error={errors.assignee_id}
                                label='Assignee'
                                placeholder='Select Team Member'
                            />
                        </div>

                        <Select
                            register={register}
                            name='epic_id'
                            options={epics.map((epic) => ({
                                value: epic.id,
                                label: `${epic.epic_id} ${epic.title.length > 100 ? epic.title.slice(0, 100) + '...' : epic.title}`,
                            }))}
                            className='flex-1'
                            error={errors.epic_id}
                            label='Epic'
                            placeholder='select epic link'
                        />
                        <Input
                            register={register}
                            name="due_date"
                            type="date"
                            label='due date'
                            placeholder="Pr"
                            error={errors.due_date}
                            className='flex-1'
                        />

                        <Textarea
                            register={register}
                            name="description"
                            placeholder="Provide detailed context for this task..."
                            error={errors.description}
                            rows={4}
                            maxLength={500}
                            className='flex-1'
                            label='description'
                        />

                        {errors.root?.message && (
                            <p className="text-sm text-red-500 mb-4">{errors.root.message}</p>
                        )}


                        <div className='flex flex-col-reverse justify-end items-center   py-4 sm:flex-row '>
                            <button
                                type="button"
                                className="btn btn-ghost mt-2 max-sm:w-full"
                                disabled={isSubmitting || isCanceling}
                                onClick={handleCancel}
                            >
                                {isCanceling ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Spinner size="sm" label="Going back" />
                                        <span>Backing</span>
                                    </span>
                                ) : 'Back'}
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary mt-2 max-sm:w-full "
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Spinner size="sm" label="Creating task" className="border-white/40 border-t-white" />
                                        <span>Create Task</span>
                                    </span>
                                ) : 'Create Task'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>

        </div>
    )
}
