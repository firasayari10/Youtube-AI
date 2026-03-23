import { UserAvatar } from "@/components/user-avatar"
import { UserGetOneOutput } from "../../types"
import { useAuth, useClerk } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button"
import { UseSubscription } from "@/modules/subscriptions/hooks/use-subscription"
import { cn } from "@/lib/utils"

interface UserPageInfoProps{
    user:UserGetOneOutput
    
}

export const UserPageInfo =({user}:UserPageInfoProps)=>{
    const {userId , isLoaded} = useAuth(); 
    const clerk = useClerk();
    const {isPending  , onClick}= UseSubscription({
        userId:user.id,
        isSubscribed: user.viewerSubscribed ,

    })

    return (
        <div className="py-6">
            <div className="flex flex-col md:hidden">
                <div className="flex items-center gap-3 ">
                    <UserAvatar  
                    size="lg"
                    imageUrl={user.imageUrl}
                    name={user.name}
                    className="h-[60px] w-[60px]"
                    onClick={()=>{
                        if(user.clerkId === userId){
                            clerk.openUserProfile();
                        }
                    }}
                    />
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl  font-bold">
                            {user.name}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <span>
                                    {user.SubscriptionCount} subscribers

                                </span>
                                <span> •</span>
                                <span>
                                    {user.videoCount} Videos
                                </span>

                            </div>

                        </h1>
                         
                    </div>

                </div>
            {
                userId === user.clerkId ? (
                    <Button 
                    variant="secondary"
                    asChild
                    className="w-full mt-3 rounded-full">
                        <Link href="/studio">  Go to Studio </Link>
                    </Button>
                ):(
                    <SubscriptionButton 
                    onClick={onClick}
                    disabled={isPending || !isLoaded}
                    isSubscribed={user.viewerSubscribed}
                    className="w-full mt-3" />
                )
            }
            </div>


            <div className="hidden  md:flex items-start  gap-4 ">
                <UserAvatar  
                    size="xl"
                    imageUrl={user.imageUrl}
                    name={user.name}
                    className={cn(userId ===  user.clerkId && "cursor-pointer hover:opacity-80" )}
                    onClick={()=>{
                        if(user.clerkId === userId){
                            clerk.openUserProfile();
                        }
                    }}
                    />

                          <div className="flex-1 min-w-0">
                            <h1 className="text-4xl  font-bold">
                            {user.name}
                            <div className="flex items-center gap-1 text-s text-muted-foreground mt-3">
                                <span>
                                    {user.SubscriptionCount} subscribers

                                </span>
                                <span> •</span>
                                <span>
                                    {user.videoCount} Videos
                                </span>

                            </div>
                            {
                userId === user.clerkId ? (
                    <Button 
                    variant="secondary"
                    asChild
                    className=" rounded-full mt-3 ">
                        <Link href="/studio">  Go to Studio </Link>
                    </Button>
                        ):(
                    <SubscriptionButton 
                    onClick={onClick}
                    disabled={isPending || !isLoaded}
                       isSubscribed={user.viewerSubscribed}
                    className=" mt-3" />
                    )
                  }

                        </h1>
                         
                    </div>
                    


            </div>

        </div>

        
    )
}