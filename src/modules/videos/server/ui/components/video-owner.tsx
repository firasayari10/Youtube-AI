import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { VideoGetOneOutput } from "@/modules/videos/types"
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

interface VideoOwnerProps {
    user: VideoGetOneOutput["user"];
    videoId: string ;

}

export const VideoOwner = ({ user , videoId}:VideoOwnerProps)=>{

    const {userId:clerkuserId} = useAuth()
    

    return (
        <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
            <Link  href={`/users/${user.id}`}>
                <div className="flex items-center gap-3 min-w-0">
                    
                    <UserAvatar size="lg" imageUrl={user.imageUrl} name={user.name} />
                        <span>
                            {0} Subscribers 
                        </span>
                </div>
            
            </Link>
            {clerkuserId === user.clerkId ? (
                <Button className="rounded-full" asChild variant="secondary">
                    <Link  href={`/studio/videos/${videoId}`}>
                    Edit Video
                    </Link>
                </Button>
                
            ): (<SubscriptionButton 
            onClick={()=>{}}
            disabled={false}
            isSubscribed={false}
            className="flex-none" />)}


        </div>
    )
}