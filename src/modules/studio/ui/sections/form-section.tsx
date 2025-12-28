"use client"

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
    FormItem
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CopyCheckIcon, CopyIcon, Globe2Icon, ImagePlusIcon, Loader2Icon, LockIcon, MoreVerticalIcon, RotateCcwIcon, SparkleIcon, SparklesIcon, TrashIcon } from "lucide-react";
import { videoUpdateSchema } from "@/db/schema";
import { toast } from "sonner";
import { VideoPlayer } from "@/modules/videos/server/ui/components/video-player";
import Link from "next/link";
import { snakeCaseToTitle } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { ThumbnailUploadModal } from "../layouts/components/thumbnail-upload-modal";
import { ThumbnailGenerateModal } from "../layouts/components/thumbnail-generate-modal";
import { Skeleton } from "@/components/ui/skeleton";

interface FormSectionProps {
    videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
    return (
        <Suspense fallback={<FallbackSkeleton />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <FormSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}

const FallbackSkeleton = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="space-y-8 lg:col-span-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-[220px] w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="flex flex-col gap-y-8 lg:col-span-2">
          <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden">
            <Skeleton className="aspect-video" />

            <div className="px-4 py-4 space-y-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-full" />
            </div>

            <div className="px-4 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 lg:col-span-5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
    const router = useRouter();
    const utils = trpc.useUtils();
   
    const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
    const [categories] = trpc.categories.getMany.useSuspenseQuery();

    const [thumbnailModalOpen , setThumbnailModalOpen] = useState(false)
    const [thumbnailGenerateModalOpen , setThumbnaiGenerateModalOpen] = useState(false)

    const update = trpc.videos.update.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate();
            utils.studio.getOne.invalidate({ id: videoId })
            toast.success("video updated")
        },
        onError: () => {
            toast.error("something went wrong!")
        }
    })
    const remove = trpc.videos.delete.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate();
            toast.success("video removed")
            router.push("/studio")
        },
        onError: () => {
            toast.error("something went wrong!")
        }
    })
     const revalidate = trpc.videos.revalidate.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate();
            utils.studio.getOne.invalidate({id:videoId});
            toast.success("video revalidated")
            
        },
        onError: () => {
            toast.error("something went wrong!")
        }
    })
    const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate();
            utils.studio.getOne.invalidate({id: videoId});
            toast.success("thumbnail restored ")
          
        },
        onError: () => {
            toast.error("something went wrong!")
        }
    })
    
    const generateTitle = trpc.videos.generateTitle.useMutation({
        onSuccess: () => {
           
            toast.success("background job started ", {description: " this may take some time  "})
          
        },
        onError: () => {
            toast.error("something went wrong!")
        }
    })
    const generateDescription = trpc.videos.generateDescription.useMutation({
        onSuccess: () => {
           
            toast.success("background job started ", {description: " this may take some time  "})
          
        },
        onError: () => {
            toast.error("something went wrong!")
        }
    })

    const form = useForm<z.infer<typeof videoUpdateSchema>>({
        resolver: zodResolver(videoUpdateSchema),
        defaultValues: video,
    })

    const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
        update.mutate(data)
    }

    const fullUrl = `${process.env.VERCEL_URL || "https://localhost:3000"}/videos/${videoId}` ;
    const [isCopied , setIsCopied] = useState(false)  ;

    const onCopy = async()=>{
        await navigator.clipboard.writeText(fullUrl);
        setIsCopied(true) ;
        setTimeout(() => {
            setIsCopied(false)
            
        }, 2000);
    }
    return (
        
        <>
        <ThumbnailUploadModal open={thumbnailModalOpen} onOpenChange={setThumbnailModalOpen} videoId={videoId} />
        <ThumbnailGenerateModal open={thumbnailGenerateModalOpen} onOpenChange={setThumbnaiGenerateModalOpen} videoId={videoId}/>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex items-center justify-between mb-6 w-full">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Video Details
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Manage your video details
                        </p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Button type="submit" disabled={update.isPending || !form.formState.isDirty}>
                            Save
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVerticalIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                 <DropdownMenuItem onClick={()=>revalidate.mutate({id:videoId})}>
                                    <RotateCcwIcon className="size-4 mr-2" />
                                    Revalidate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={()=>remove.mutate({id:videoId})}>
                                    <TrashIcon className="size-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="space-y-8 lg:col-span-3">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <div className="flex items-center gap-x-2">
                                            Title
                                            <Button
                                            size="icon"
                                            variant={"outline"}
                                            type="button"
                                            className="rounded-full size-6 [&_svg]:size-3"
                                            onClick={()=>generateTitle.mutate({id:videoId})}
                                            disabled={generateTitle.isPending || !video.muxTrackId}
                                            >
                                                {generateTitle.isPending ?
                                                <Loader2Icon  className="animate-spin"/> : <SparklesIcon/>}
                                              
                                            </Button>
                                        </div>
                                        
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="add a title to your video" className="pr-10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <div className="flex items-center gap-x-2">
                                            Description
                                            <Button
                                            size="icon"
                                            variant={"outline"}
                                            type="button"
                                            className="rounded-full size-6 [&_svg]:size-3"
                                            onClick={()=>generateDescription.mutate({id:videoId})}
                                            disabled={generateDescription.isPending || !video.muxTrackId}
                                            >
                                                {generateDescription.isPending ?
                                                <Loader2Icon  className="animate-spin"/> : <SparklesIcon/>}
                                              
                                            </Button>
                                        </div>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea {...field} value={field.value ?? ""}
                                            rows={10}
                                            placeholder="add a Description to your video" className="pr-10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                         <FormField 
                            name="thumbnailUrl"
                            control={form.control}
                            render={() => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative group w-fit">
                                            <div className="p-0.5 border border-dashed border-neutral-400 relative h-[84px] w-[153px]">
                                                <Image 
                                                    src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                                                    alt="Thumbnail"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        className="absolute top-1 right-1 size-7 rounded-full bg-black/50 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition duration-300"
                                                    >
                                                        <MoreVerticalIcon className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="start" side="right">
                                                        <DropdownMenuItem onClick={()=>setThumbnailModalOpen(true)}>
                                                            <ImagePlusIcon  className="size-4 mr-1"/>
                                                            Change
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={()=> setThumbnaiGenerateModalOpen(true)}>
                                                            <SparkleIcon  className="size-4 mr-1"/>
                                                            Ai- generated
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={()=>restoreThumbnail.mutate({id:videoId})}>
                                                            <RotateCcwIcon  className="size-4 mr-1"/>
                                                            Restore
                                                        </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Category
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value ?? undefined}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </div>
                    <div className="flex flec-col gap-y-8 lg:col-span-2">
                        <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
                            <div className="aspect-video overflow-hidden relative">
                                <VideoPlayer 
                                playbackId={video.muxPlaybackId}
                                thumbnailUrl={video.thumbnailUrl}/>
                            </div>
                            <div className="p-4 flex flex-col gap-y-6">
                                <div className="flex justify-between items-center gap-x-2">
                                    <div className="flex flex-col gap-y-12">
                                        <p className="text-muted-foreground text-xs">
                                            video Link
                                        </p>
                                        <div className="flex items-center gap-x-2">
                                            <Link href={`/videos/${video.id}`}>
                                                <p>
                                                   {fullUrl}
                                                </p>
                                                </Link>
                                                <Button 
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="shrink-0"
                                                onClick={onCopy}
                                                disabled={isCopied} >
                                                    {isCopied ? <CopyCheckIcon />: <CopyIcon /> }
                                                </Button>

                                        </div>

                                    </div>

                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col gap-y-1">
                                        <p className="text-muted-foreground text-xs">
                                            Video Status
                                        </p>
                                        <p className="text-sm">
                                            {snakeCaseToTitle(video.muxStatus || "preparing")}
                                        </p>

                                    </div>
                                    
                                </div>
                                 <div className="flex justify-between items-center">
                                    <div className="flex flex-col gap-y-1">
                                        <p className="text-muted-foreground text-xs">
                                            Subtitles  Status
                                        </p>
                                        <p className="text-sm">
                                            {snakeCaseToTitle(video.muxTrackStatus || "no subtitles ")}
                                        </p>

                                    </div>
                                    
                                </div>

                            </div>

                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Visibility</FormLabel>

                                    <Select  
                                        onValueChange={(v) => field.onChange(v)}
                                        defaultValue={
                                        typeof field.value === "string" ? field.value : undefined
                                        }
                                    >
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="select visibility" />
                                        </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                        <SelectItem value="public">
                                            <div className="flex items-center">
                                                <Globe2Icon className="size-4 mr-2"/>
                                                    Public
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="private">
                                            <div className="flex items-center">
                                                <LockIcon className="size-4 mr-2"/>
                                                Private
                                            </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                    </FormItem>
                                )}
                                />

                        </div>

                        

                        
                    </div>
                </div>
            </form>
        </Form>
        </>
    )
}