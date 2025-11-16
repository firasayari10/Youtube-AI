"use client"
import { trpc} from "@/trpc/client";

export const PageClient = ()=>{
    const { data, error, isLoading } = trpc.hello.useQuery({
        text:"firas"
    })
    
    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="font-bold text-red-700">Error:</p>
                <p className="text-red-600">{error.message}</p>
            </div>
        )
    }
    
    if (isLoading) {
        return <div>Loading...</div>
    }
    
    return (
        <div>
            Page Client says: {data?.greeting}
        </div>
    )
}