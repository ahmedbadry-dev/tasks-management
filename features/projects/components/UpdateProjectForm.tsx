"use client";


import { Input } from '@/shared/components/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { AddProjectFormSchema, TAddProjectFormSchema } from '../validations/AddProjectFormSchema';
import { AddUserIcon, BellIcon } from '@/shared/components/icons';
import { Textarea } from '@/shared/components/Textarea';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { updateProjectAction } from '../actions/updateProjectAction';
import { TProject } from '../types';
import { TUpdateProjectFormSchema, UpdateProjectFormSchema } from '../validations/UpdateProjectFormSchema';


type UpdateProjectFormProps = {
    projectDetails: TProject
}


export const UpdateProjectForm = ({ projectDetails }: UpdateProjectFormProps) => {
    const [isCanceling, setIsCanceling] = useState(false)
    const router = useRouter()

    const { projectId } = useParams<{ projectId: string }>()

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<TUpdateProjectFormSchema>({
        resolver: zodResolver(UpdateProjectFormSchema),
        defaultValues: {
            name: projectDetails.name,
            description: projectDetails.description ?? ''
        },
        mode: 'onBlur'
    })



    const onSubmit: SubmitHandler<TUpdateProjectFormSchema> = async (data) => {
        const result = await updateProjectAction(projectId, {
            name: data.name,
            description: data.description ?? null,
        })

        if (result?.success === false) {
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
                    {/* card header */}
                    <div className="flex items-center gap-4 pb-10 ">
                        <div className=' hidden sm:flex justify-center items-center w-11 h-11 bg-primary-container/10 rounded-md'>
                            <AddUserIcon className='text-primary' />
                        </div>
                        <div>
                            <h1 className="heading-2">Update Yore Project</h1>
                            <p className="type-body-md">Define the scope and foundational details of your project.</p>
                        </div>
                    </div>

                    {/* card content */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            register={register}
                            name="name"
                            label="Project TITLE "
                            type="text"
                            placeholder="Pr"
                            error={errors.name}
                        />
                        <Textarea
                            register={register}
                            name="description"
                            label="Description"
                            placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
                            error={errors.description}
                            hint="Optional"
                            rows={4}
                            maxLength={500}
                        />
                        {errors.root?.message && (
                            <p className="text-sm text-red-500 mb-4">{errors.root.message}</p>
                        )}

                        <div className='flex flex-col-reverse justify-between items-center   py-4 sm:flex-row '>
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
                                {isSubmitting ? 'Updating...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
                {/* card Pro Tip */}
                <div className="flex justify-center items-center gap-2 bg-surface-low p-6 ">

                    <div className='hidden sm:block'>
                        <BellIcon />
                    </div>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                        <span className='type-body-md text-[12px] font-bold '>Pro Tip</span>
                        <p className="type-body-md text-[12px]"> You can invite project members and assign epics immediately after the initial creation process.</p>
                    </div>
                </div>
            </div>

        </div>
    )
}
