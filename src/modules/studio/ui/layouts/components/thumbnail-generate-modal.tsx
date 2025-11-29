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
import {useForm} from "react-hook-form"
import { Textarea} from "@/components/ui/textarea"
import {toast} from "sonner"
import { Button} from "@/components/ui/button"
interface ThumbnailGenerateModalProps{
    videoId:string;
    open: boolean;
    onOpenChange: (open:boolean)=>void;
}

const formschema = z.object({
    prompt:z.string().min(10)
})

export const ThumbnailGenerateModal=({videoId,open ,onOpenChange}:ThumbnailGenerateModalProps)=>{
    const form = useForm<z.infer<typeof formschema >>({
        resolver: zodResolver(formschema),
        defaultValues:{
            prompt:""
        }
    });
    
     const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
            onSuccess: () => {
               
                toast.success("background job started ", {description: " this may take some time  "})
              
            },
            onError: () => {
                toast.error("something went wrong!")
            }
        })
    const onSubmit = ( values : z.infer<typeof formschema>)=>{
       generateThumbnail.mutate({
        prompt:values.prompt,
        id:videoId
       })

    }
    return(
    <ResponsiveModal title="upload a thumbnail " open={open} onOpenchange={onOpenChange}>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            >
                <FormField 
                control={form.control}
                name="prompt"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Prompt
                        </FormLabel>
                        <FormControl>
                            <Textarea {...field}
                            className="resize-none"
                            cols={30}
                            rows={5}
                            placeholder=" wanted thumbnail description"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <div className=" flex justify-end">
                    <Button type="submit" disabled={generateThumbnail.isPending}
                    >
                        Generate
                    </Button>

                </div>


            </form>

        </Form>
    </ResponsiveModal>)
}