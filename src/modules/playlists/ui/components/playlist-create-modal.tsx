import {ResponsiveModal} from "@/components/responsive-modal" ;
import { Form } from "@/components/ui/form";
import { trpc } from "@/trpc/client";
import z from "zod";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
}from "@/components/ui/form";
import { zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form";
import {toast} from "sonner"
import { Button} from "@/components/ui/button"
import { Input } from "@/components/ui/input";


interface PlaylistCreateModalProps{
    open: boolean;
    onOpenChange: (open:boolean)=>void;
}

const formschema = z.object({
    name:z.string().min(10)
})

export const PlaylistCreateModal=({open ,onOpenChange}:PlaylistCreateModalProps)=>{
    const form = useForm<z.infer<typeof formschema >>({
        resolver: zodResolver(formschema),
        defaultValues:{
            name:"",
        }
    });
    const utils = trpc.useUtils();
     const create = trpc.playlists.create.useMutation({
            onSuccess: () => {
                utils.playlists.getMany.invalidate();
                toast.success("Playlist created ");
                form.reset();
                onOpenChange(false);
              
            },
            onError: () => {
                toast.error("something went wrong!")
            }
        })
    const onSubmit = ( values : z.infer<typeof formschema>)=>{
       create.mutate(values);

    }
    return(
    <ResponsiveModal title="Create a Playlist" open={open} onOpenchange={onOpenChange}>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            >
                <FormField 
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Prompt
                        </FormLabel>
                        <FormControl>
                            <Input {...field}
                            
                            placeholder=" Playlist #1"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <div className=" flex justify-end">
                    <Button type="submit" disabled={create.isPending}
                    >
                       Create
                    </Button>

                </div>


            </form>

        </Form>
    </ResponsiveModal>)
}