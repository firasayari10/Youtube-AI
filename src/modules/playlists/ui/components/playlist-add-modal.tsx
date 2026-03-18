import {ResponsiveModal} from "@/components/responsive-modal" ;



interface PlaylistAddModalProps{
    open: boolean;
    onOpenChange: (open:boolean)=>void;
}


export const PlaylistAddModal=({open ,onOpenChange}:PlaylistAddModalProps)=>{
    
    return(
    <ResponsiveModal title="Add video to a playlist" open={open} onOpenchange={onOpenChange}>
       <div className="flex flex-col gap-2">

       </div>
    </ResponsiveModal>)
}