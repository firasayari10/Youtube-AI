"use client"
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface HomeVideosSectionProps{
    categoryId?: string;
}



export const HomeVideosSection=(props:HomeVideosSectionProps)=>{
    return(
       <Suspense fallback={<HomeVideosSectionSuspenseSkeleton  />}>
        <ErrorBoundary fallback={<p> error </p>}>
        <HomeVideosSectionSuspense  {...props}/>

        </ErrorBoundary>
       </Suspense>
    )
}


const HomeVideosSectionSuspenseSkeleton =()=>{
    return (
        <p>
            Loading 
        </p>
    )
}

const HomeVideosSectionSuspense = ({categoryId}:HomeVideosSectionProps)=>{
    const [videos,query ]= trpc.videos.getMany.useSuspenseInfiniteQuery(
        {categoryId,limit:DEFAULT_LIMIT},
        {
            getNextPageParam:(lastPage) =>lastPage.nextCursor,
        }
    );

    return (
        <div>
            {JSON.stringify(videos)}
        </div>
    )

}