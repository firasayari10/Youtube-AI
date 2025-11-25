"use client"
import { ResponsiveModal } from "@/components/responsive-modal"
import {Button} from "@/components/ui/button"
import { trpc } from "@/trpc/client"
import { Loader2Icon, PlusIcon} from "lucide-react" 
import { toast } from "sonner"
import { StudioUploader } from "./studio-uploader"
import { useRouter } from "next/navigation"


export const StudioUploadModal = ()=>{
    const router = useRouter();
    const utils = trpc.useUtils();
    const create = trpc.videos.create.useMutation({
        onSuccess:()=>{
            toast.success("video created ")
            utils.studio.getMany.invalidate();
        },
        onError:(error)=>{
            toast.error(error.message)
        }
    })
    const onSucces = ()=>{
        if(!create.data?.video.id) return ;
        create.reset();
        router.push(`/studio/videos/${create.data.video.id}`)

    }
    return (
        <>
        <ResponsiveModal  title="Uplaod a video " 
        open={!!create.data?.url} 
        onOpenchange={()=>create.reset()}>
            {create.data?.url ? 
            <StudioUploader endpoint={create.data.url} onSuccess={onSucces}/> 
            : <Loader2Icon />}
        </ResponsiveModal>
        <Button variant="secondary" onClick={()=>create.mutate()} disabled={create.isPending}>
            { create.isPending ? <Loader2Icon  className="animate-spin"/> :<PlusIcon />}
            Create

        </Button>
        
        </>
    )
    
}