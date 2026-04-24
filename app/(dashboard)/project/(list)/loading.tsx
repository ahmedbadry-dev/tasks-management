import { Spinner } from "@/shared/components/Spinner"


const loading = () => {
    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <Spinner />
        </div>
    )
}

export default loading
