"use client"
import { InfiniteScroll } from "@/components/infinite-scroll"
import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import Link from "next/link"
import { VideoThumbnail } from "@/modules/videos/server/ui/components/video-thumbnail"

export const VideosSection = () => {
    return (
        <Suspense fallback={<p>Loading ...</p>}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <VideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

export const VideosSectionSuspense = () => {
    const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
        {
            limit: DEFAULT_LIMIT,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor
        }
    )

    return (
        <div>
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">Video</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                            <TableHead className="text-right">Comments</TableHead>
                            <TableHead className="text-right pr-6">Likes</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {videos.pages
                            .flatMap((p) => p.items)
                            .map((video) => (
                                <TableRow
                                    key={video.id}
                                    className="cursor-pointer hover:bg-muted/30"
                                >
                                    <TableCell>
                                        <Link href={`/studio/videos/${video.id}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-md">
                                                    <VideoThumbnail 
                                                    imageUrl= {video.thumbnailUrl} 
                                                    previewUrl={video.previewUrl}
                                                    title={video.title}
                                                    duration={video.duration || 0}/>
                                                </div>
                                                <span className="font-medium truncate max-w-[320px]">
                                                    {video.title}
                                                </span>
                                            </div>
                                        </Link>
                                    </TableCell>

                                    <TableCell>Visibility</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell className="text-right">Views</TableCell>
                                    <TableCell className="text-right">Comments</TableCell>
                                    <TableCell className="text-right pr-6">Likes</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>

            <InfiniteScroll
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
            />
        </div>
    )
}
