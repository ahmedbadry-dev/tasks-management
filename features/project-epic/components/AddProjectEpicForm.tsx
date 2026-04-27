"use client";


import { Input } from '@/shared/components/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Textarea } from '@/shared/components/Textarea';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@/shared/components/Select';
import { AddProjectEpicSchema, TAddProjectEpicSchema } from '../validations/AddProjectEpicSchema';
import { addProjectEpicAction } from '../actions/addProjectEpicAction';
import { TMember } from '../types';
import { toast } from 'sonner';
import { routes } from '@/lib/routes';

type TAddProjectEpicFormProps = {
    projectId: string
    members: TMember[]
}



export const AddProjectEpicForm = ({ members = [], projectId }: TAddProjectEpicFormProps) => {
    const [isCanceling, setIsCanceling] = useState(false)
    const router = useRouter()

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, clearErrors } = useForm<TAddProjectEpicSchema>({
        resolver: zodResolver(AddProjectEpicSchema),
        defaultValues: {
            title: '',
            description: '',
            deadline: '',
            assignee_id: ''
        },
        mode: 'onBlur'
    })



    const onSubmit: SubmitHandler<TAddProjectEpicSchema> = async (data) => {
        clearErrors('root')

        const result = await addProjectEpicAction({
            project_id: projectId,
            title: data.title,
            description: data.description ?? null,
            assignee_id: data.assignee_id,
            deadline: data.deadline,
        })

        if (result.ok) {
            toast.success('Epic created successfully!')
            router.push(routes.project.epics(projectId))
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

                        <label className='sm:flex'>
                            <span className='min-w-40 field-label'>Title <span className='text-error'>*</span></span>
                            <Input
                                register={register}
                                name="title"
                                type="text"
                                placeholder="Pr"
                                error={errors.title}
                                className='flex-1'
                            />
                        </label>

                        <label className='sm:flex'>
                            <div className='flex justify-between sm:flex-col sm:justify-start'>
                                <span className='min-w-40 field-label'>Description</span>
                                <span className='field-hint'>Optional</span>
                            </div>
                            <Textarea
                                register={register}
                                name="description"
                                placeholder="Describe the scope and objectives of this epic..."
                                error={errors.description}
                                rows={4}
                                maxLength={500}
                                className='flex-1'
                            />
                        </label>

                        <div className='flex flex-col sm:flex-row sm:gap-4'>
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
                                placeholder='select member'
                            />
                            <Input
                                register={register}
                                name="deadline"
                                type="date"
                                label='Deadline'
                                placeholder="Pr"
                                error={errors.deadline}
                                className='flex-1'
                            />
                        </div>

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
                                {isCanceling ? 'Canceling...' : 'Cancel'}
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary mt-2 max-sm:w-full "
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating Epic...' : 'Create Epic'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>

        </div>
    )
}
