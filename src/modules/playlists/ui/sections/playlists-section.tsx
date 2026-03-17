"use client"
import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { VideoGridCardSkeleton } from "@/modules/videos/server/ui/components/video-grid-card";
import { VideoRowCardSkeleton } from "@/modules/videos/server/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";



export const PlaylistsSection=()=>{
    return(
       <Suspense fallback={<PlaylistsSectionSuspenseSkeleton  />}>
        <ErrorBoundary fallback={<p> error </p>}>
        <PlaylistsSectionSuspense  />

        </ErrorBoundary>
       </Suspense>
    )
}


const PlaylistsSectionSuspenseSkeleton = () => {
    return (
        <div>
           
            <div className="flex flex-col gap-4 gap-y-10 md:hidden">
                {Array.from({ length: 8 }).map((_, index) => (
                    <VideoGridCardSkeleton key={index} />
                ))}
            </div>

            <div className="hidden md:flex flex-col gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <VideoRowCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};

const PlaylistsSectionSuspense = ()=>{
    const [playlists,query ]= trpc.playlists.getMany.useSuspenseInfiniteQuery(
        {limit:DEFAULT_LIMIT},
        {
            getNextPageParam:(lastPage) =>lastPage.nextCursor,
        }
    );

    return (
    <div>
        <div className="flex flex-col gap-4 gap-y-10 ">
            {JSON.stringify(playlists)}
        </div>
        <div className="hidden md:flex flex-col gap-4">
          
        </div>

        <InfiniteScroll
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
        />
    </div>
);

}