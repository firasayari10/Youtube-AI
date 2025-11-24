"use client"

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
}from "@/components/ui/dropdown-menu" ;
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
    FormItem
} from "@/components/ui/form";
import { Textarea} from "@/components/ui/textarea" 
import {Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
}from "@/components/ui/select" 
import {TypeOf, z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm} from "react-hook-form"
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import { videoUpdateSchema } from "@/db/schema";
interface FormSectionProps{
    videoId:string;
}
export const FormSection = ({videoId}:FormSectionProps)=>{
    return (
        <Suspense fallback={<FallbackSkeleton />}>
            <ErrorBoundary fallback={<p>
                Error
            </p>}>
                <FormSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}

const FallbackSkeleton = ()=>{
    return <p>
        loading ;
    </p>
}
 const FormSectionSuspense =({videoId}:FormSectionProps)=>{
    const [video] = trpc.studio.getOne.useSuspenseQuery({id:videoId}) ; 
    const form = useForm<z.infer<typeof videoUpdateSchema>>({
        resolver: zodResolver(videoUpdateSchema) ,
        defaultValues:video,
    })
    const onSubmit = async(data: z.infer<typeof videoUpdateSchema>)=>{
        console.log(data)
    }
    

    return (
        <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Video Details                    
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Manage your video details
                            </p>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Button type="submit" disabled={false}>
                                Save
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVerticalIcon />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem>
                                        <TrashIcon className="size-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>
                    
                    </div>
            </form>
        </Form>
    )

 }