import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PlaylistHeaderSectionProps{
    playlistId: string ;
}


export const PlaylistHeaderSection=({playlistId}:PlaylistHeaderSectionProps)=>{
    return(
        <Suspense fallback={<p>Loading ...</p>}>
            <ErrorBoundary fallback={<p> error</p>} >
            <PlaylistHeaderSectionSuspense   playlistId={playlistId}/>

            </ErrorBoundary>

        </Suspense>
    )

}

export const PlaylistHeaderSectionSuspense=({playlistId}:PlaylistHeaderSectionProps)=>{
    return (
        <div className="flex justify-between items-center">
           <div>
            <h1 className="text-2xl font-bold">
                Custom playlist 
            </h1>
            <p className="text-xs text-muted-foreground">
                Videos from your playlits

            </p>
           </div>
           <Button variant="outline"
           size="icon"
           className="rounded-full">
            <Trash2Icon  />

           </Button>

        </div>
    )
}