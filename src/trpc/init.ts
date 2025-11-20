import { db } from "@/db";
import { users } from "@/db/schema";
import { ratelimit } from "@/lib/rate-limit";
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError, } from "@trpc/server" ;
import { eq } from "drizzle-orm";
import { cache} from "react" ;
import superjson from "superjson"

export const createTRPCContext = cache(async()=>{
    const {userId} = await auth()
    /**
     * @see https://trpc.io/docs/server/context
     */
    return {clerkUserId: userId ?? null}
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>


const t = initTRPC.context<Context>().create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
     transformer : superjson,
    
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;






export const protectedProcedure = t.procedure.use(async function isAuthed(opts){
    const {ctx} = opts;
    if(!ctx.clerkUserId)
    {
        throw new TRPCError({code:"UNAUTHORIZED"})
    }
    let user = (await db.select()
    .from(users)
    .where(eq(users.clerkId , ctx.clerkUserId))
    .limit(1))[0]
    
    if (!user)
    {
        const clerkUser = await auth();
        if (!clerkUser.userId) {
            throw new TRPCError({code:"UNAUTHORIZED"})
        }
        const firstName = typeof clerkUser.sessionClaims?.first_name === 'string' ? clerkUser.sessionClaims.first_name : '';
        const lastName = typeof clerkUser.sessionClaims?.last_name === 'string' ? clerkUser.sessionClaims.last_name : '';
        const imageUrl = typeof clerkUser.sessionClaims?.image === 'string' ? clerkUser.sessionClaims.image : '';
        const fullName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : 'User';
        
        const [insertedUser] = await db.insert(users).values({
            clerkId: ctx.clerkUserId,
            name: fullName,
            imageUrl: imageUrl,
        }).returning();
        user = insertedUser;
    }
    
    const {success} = await ratelimit.limit(user.id);

    
    if(!success){
        
        throw new TRPCError({code:"TOO_MANY_REQUESTS"})
    }
    
    return opts.next({
        ctx:{
            ...ctx,
            user,
        }
    })
})