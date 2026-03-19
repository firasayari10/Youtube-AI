import {ResponsiveModal} from "@/components/responsive-modal" ;
import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";

import { Loader2Icon } from "lucide-react";




interface PlaylistAddModalProps{
    open: boolean;
    onOpenChange: (open:boolean)=>void;
    videoId:string
}


export const PlaylistAddModal=({open ,onOpenChange,videoId}:PlaylistAddModalProps)=>{
    const utils = trpc.useUtils() ;

    const {
        data:playlists,
         isLoading,
         
    }=trpc.playlists.getManyForVideo.useInfiniteQuery({
        limit:DEFAULT_LIMIT,
        videoId,
    },{
        getNextPageParam:(lastPage)=>lastPage.nextCursor,
        enabled:!!videoId&& open ,
    })

    
    return(
    <ResponsiveModal title="Add video to a playlist" open={open} onOpenchange={onOpenChange}>
       <div className="flex flex-col gap-2">
          {isLoading && (
            <div className="flex justify-center gap-2">
                <Loader2Icon  className="size-5 animate-spin  text-muted-foreground"/>

            </div>
          )
}
{
    !isLoading && 
    playlists?.pages.flatMap((page)=>page.items).map((playlist)=>(
        <Button key={playlist.id}>
            {playlist.name}

        </Button>
    ))
}
       </div>
    </ResponsiveModal>)
}