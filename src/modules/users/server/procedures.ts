import { db } from "@/db";
import { subscriptions, users, videos } from "@/db/schema";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {   eq, getTableColumns, inArray, isNotNull} from "drizzle-orm";



import z from "zod/v3";

export const usersRouter = createTRPCRouter({

  getOne: baseProcedure.
  input(z.object({id: z.string().uuid()}))
  .query(async({input, ctx })=>{
    const {clerkUserId}= ctx; 
    let userId;
    const [user] = await db.select().from(users)
    .where(inArray(users.clerkId,clerkUserId ? [clerkUserId]: []))

    if(user)
    {
      userId = user.id
    }
    

    const viewerSubscriptions = db.$with("viewer_subscriptions").as(
      db.select()
      .from(subscriptions)
      .where(inArray(subscriptions.viewerId, userId ? [userId] : []))
    )

    

    const [ exisitngUser] = await db
    .with(viewerSubscriptions)
    .select({
        ...getTableColumns(users),
        viewerSubscribed:isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean),
        SubscriptionCount:db.$count(subscriptions ,eq( subscriptions.creatorId,users.id)),
        videoCount:db.$count(videos , eq(videos.categoryId, users.id)),
    })
    .from(users)
    .leftJoin(viewerSubscriptions , eq(viewerSubscriptions.creatorId , users.id))
    .where(eq(users.id , input.id))
   

    if(!exisitngUser)
    {
      throw new TRPCError({code:"NOT_FOUND"})
    }
    return exisitngUser ;

  }),
 
});