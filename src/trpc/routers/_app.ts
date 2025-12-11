import { categoriesRouter} from "@/modules/categories/server/procedures"
import {   createTRPCRouter, } from "../init" ;
import { studioRouter } from "@/modules/studio/server/procedures";
import { videosRouter } from "@/modules/videos/server/procedures";
import { videoViewsRouter } from "@/modules/video-views/procedure";
import { videoReactionsRouter } from "@/modules/video-reactions/procedure";
import { subscriptionsRouter } from "@/modules/subscriptions/server/procedures";


export const appRouter = createTRPCRouter({
    videos: videosRouter,
    categories : categoriesRouter,
    studio: studioRouter,
    videoViews: videoViewsRouter,
    videoReactions: videoReactionsRouter,
    subscriptions : subscriptionsRouter 
    
    
});

export type AppRouter = typeof appRouter ;