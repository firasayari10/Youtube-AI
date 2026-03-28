import { db } from "@/db";
import { subscriptions, users, videos } from "@/db/schema";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {   eq, getTableColumns, isNotNull} from "drizzle-orm";



import z from "zod/v3";

export const usersRouter = createTRPCRouter({

  getOne: baseProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ input, ctx }) => {
    const { clerkUserId } = ctx;
    let userId: string | undefined;

    if (clerkUserId) {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkUserId));

      userId = user?.id;
    }
    const viewerSubscriptions = db.$with("viewer_subscriptions").as(
      userId
        ? db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.viewerId, userId))
        : db
            .select({
              viewerId: subscriptions.viewerId,
              creatorId: subscriptions.creatorId,
            })
            .from(subscriptions)
            .where(eq(subscriptions.viewerId, "__never__")) 
    );

    const [existingUser] = await db
      .with(viewerSubscriptions)
      .select({
        ...getTableColumns(users),

        viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean),

        subscriberCount: db.$count(
          subscriptions,
          eq(subscriptions.creatorId, users.id)
        ),

        videoCount: db.$count(
          videos,
          eq(videos.userId, users.id) 
        ),
      })
      .from(users)
      .leftJoin(
        viewerSubscriptions,
        eq(viewerSubscriptions.creatorId, users.id)
      )
      .where(eq(users.id, input.id));


    if (!existingUser) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return existingUser;
  }),
 
});