import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { commentInsertSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { useClerk, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";


interface CommentFormProps {
    videoId: string ;
    parentId?:string;
    onSuccess?:()=>void ;
    onCancel?:()=>void;
    variant?:"comment" |"reply",
};

const commentFormSchema = commentInsertSchema.omit({userId:true});

export const CommentForm = ({
    videoId, 
    parentId,
    onSuccess,
    onCancel,
    variant,
}:CommentFormProps)=>{
    const {user, isSignedIn} = useUser();
    const clerk = useClerk();
    const utils = trpc.useUtils();
    
    const create = trpc.comments.create.useMutation({
        onSuccess:()=>{
            utils.comments.getMany.invalidate({videoId});
            form.reset();
            toast.success("Comment successfully added!");
            onSuccess?.();
        },
        onError:(error)=>{
            console.log("Error:", error);
            console.log("Error code:", error.data?.code); 
            
            if(error.data?.code === "UNAUTHORIZED"){
                clerk.openSignIn();
            } else {
                toast.error(error.message || "Failed to add comment");
            }
        }
    });
    
    const form = useForm<z.infer<typeof commentFormSchema>>({
        resolver: zodResolver(commentFormSchema),
        defaultValues: {
            parentId:parentId,
            videoId,
            value: "",
        }
    });

    const handleSubmit = (values: z.infer<typeof commentFormSchema>) => {
        
        if (!isSignedIn) {
            clerk.openSignIn();
            return;
        }
        
        create.mutate(values);
    };

    const handleCancel=()=>{
        form.reset();
        onCancel?.()
    }

    return (
        <Form {...form}>
            <form className="flex gap-4 group" onSubmit={form.handleSubmit(handleSubmit)}>
                <UserAvatar 
                    size="lg"
                    imageUrl={user?.imageUrl || "/user-placeholder.svg"}
                    name={user?.username || "User"}
                />
                <div className="flex-1">
                    <FormField
                        name="value"
                        control={form.control}
                        render={({field})=>(
                            <FormItem>
                                <FormControl>
                                    <Textarea 
                                        {...field}
                                        placeholder= {
                                            variant === "reply" 
                                            ? "Reply to this comment ...."
                                            : "Add a comment "
                                        }
                                        className="resize-none bg-transparent overflow-hidden min-h-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} 
                    />
                    
                    <div className="justify-end gap-2 mt-2 flex">
                        {onCancel && (
                            <Button variant="ghost" type="button" onClick={handleCancel}>
                                Cancel 
                            </Button>
                        )}
                        <Button
                            disabled={create.isPending}
                            type="submit"
                            size="sm"
                        >
                          {variant === "reply" ? "Reply " : "Comment"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};