import { UserAvatar } from "@/components/user-avatar"
import { UserGetOneOutput } from "../../types"
import { useAuth, useClerk } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button"
import { UseSubscription } from "@/modules/subscriptions/hooks/use-subscription"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface UserPageInfoProps{
    user:UserGetOneOutput
    
}

export const UserPageInfoSkeleton =()=>{
    return (
        <div className="py-6">
            <div className="flex flex-col md:hidden">
                <Skeleton  className="h-[60px] w-[60px] rounded-full"/>
                <div className="flex-1 min-w-0">
                    <Skeleton  className="h-6 w-32"/>
                    <Skeleton   className="h-4 w-48 mt-1"/>

                </div>
                    <Skeleton  className="h-10 w-full mt-3 rounded-full "/>
            </div>
            <div className="hidden md:flex items-start gap-4">
                <Skeleton  className="h-[160px] w-[160px]  rounded-full"/>
                <div className="flex-1 min-w-0">
                    <Skeleton  className="h-8 w-64"/>
                    <Skeleton   className="h-5 w-48 mt-4"/>
                    <Skeleton  className="h-10 w-32  mt-3 rounded-full"/>

                </div>

            </div>
                
        </div>


    )
}

export const UserPageInfo = ({ user }: UserPageInfoProps) => {
    const { userId, isLoaded } = useAuth();
    const clerk = useClerk();
    const { isPending, onClick } = UseSubscription({
        userId: user.id,
        isSubscribed: user.viewerSubscribed,
    });
    return (
        <div className="py-4 px-4 md:px-0">
            <div className="flex flex-col md:hidden">
                <div className="flex items-center gap-3">
                    <UserAvatar
                        size="sm"
                        imageUrl={user.imageUrl}
                        name={user.name}
                        className="h-10 w-10 shrink-0"
                        onClick={() => {
                            if (user.clerkId === userId) clerk.openUserProfile();
                        }}
                    />
                    <div className="flex-1 min-w-0">
                        <h1 className="text-sm font-semibold truncate">
                            {user.name}
                        </h1>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <span>{user.SubscriptionCount} subscribers</span>
                            <span>•</span>
                            <span>{user.videoCount} Videos</span>
                        </div>
                    </div>
                </div>
                {userId === user.clerkId ? (
                    <Button variant="secondary" asChild className="w-full mt-2 rounded-full text-xs h-8">
                        <Link href="/studio">Go to Studio</Link>
                    </Button>
                ) : (
                    <SubscriptionButton
                        onClick={onClick}
                        disabled={isPending || !isLoaded}
                        isSubscribed={user.viewerSubscribed}
                        className="w-full mt-2"
                    />
                )}
            </div>
            <div className="hidden md:flex flex-row items-center gap-4 py-4">
                <UserAvatar
                    size="lg"
                    imageUrl={user.imageUrl}
                    name={user.name}
                    className={cn("h-16 w-16 shrink-0", userId === user.clerkId && "cursor-pointer hover:opacity-80")}
                    onClick={() => {
                        if (user.clerkId === userId) clerk.openUserProfile();
                    }}
                />
                <div className="flex flex-col min-w-0">
                    <h1 className="text-xl font-bold truncate">
                        {user.name}
                    </h1>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                        <span>{user.SubscriptionCount} subscribers</span>
                        <span>•</span>
                        <span>{user.videoCount} Videos</span>
                    </div>
                    {userId === user.clerkId ? (
                        <Button variant="secondary" asChild className="mt-2 rounded-full text-sm h-8 w-fit">
                            <Link href="/studio">Go to Studio</Link>
                        </Button>
                    ) : (
                        <SubscriptionButton
                            onClick={onClick}
                            disabled={isPending || !isLoaded}
                            isSubscribed={user.viewerSubscribed}
                            className="mt-2 w-fit"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};