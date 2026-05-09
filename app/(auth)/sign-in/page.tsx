import { SignInForm } from "@/features/auth"

type SignInPageProps = {
    searchParams: Promise<{ redirectTo?: string | string[] }>
}

const page = async ({ searchParams }: SignInPageProps) => {
    const resolvedSearchParams = await searchParams
    const redirectToValue = resolvedSearchParams.redirectTo
    const redirectTo = typeof redirectToValue === 'string' ? redirectToValue : undefined

    return (
        <SignInForm redirectTo={redirectTo} />
    )
}

export default page
