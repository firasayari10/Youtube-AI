import {db} from "@/db"
import {videos} from "@/db/schema"
import{ baseProcedure, createTRPCRouter } from "@/trpc/init" 
import { TRPCError } from "@trpc/server"

import {eq , and , or , lt ,desc} from "drizzle-orm"
import {z} from "zod"
export const suggestionsRouter = createTRPCRouter({
    getMany:baseProcedure.input(z.object({
        videoId:z.string().uuid(),
        cursor:z.object({
            id:z.string().uuid(),
            updatedAt:z.date(),
        })
        .nullish(),
        limit: z.number().min(1).max(100)
    }))
    .query(async({input})=>{
        const {videoId , cursor,limit}=input ;
        const [existingVideo] = await db 
        .select()
        .from(videos)
        .where(eq(videos.id , videoId))

        if(!existingVideo )
        {
            throw new TRPCError({code:"NOT_FOUND"});
          
        }
       
        const data = await db.select().from(videos).
        where(
            and(
                existingVideo.categoryId
                ?
                eq(videos.categoryId,existingVideo.categoryId) :
                undefined,
        cursor ? or(
            lt( videos.updatedAt , cursor.updatedAt),
        and(
            eq(videos.updatedAt,cursor.updatedAt),
            lt(videos.id,cursor.id)
        )):undefined,
    )).orderBy(desc(videos.updatedAt),desc(videos.id)).limit(limit + 1)

    const hasMore = data.length > limit ;
    const items = hasMore ? data.slice(0,-1):data;
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore ? 
    {
        id:lastItem.id,
        updatedAt: lastItem.updatedAt
    }:null

        return {
            items , nextCursor
        }
    })
})