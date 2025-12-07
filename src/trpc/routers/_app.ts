import { categoriesRouter} from "@/modules/categories/server/procedures"
import {   createTRPCRouter, } from "../init" ;
import { studioRouter } from "@/modules/studio/server/procedures";
import { videosRouter } from "@/modules/videos/server/procedures";
import { videoViewsRouter } from "@/modules/video-views/procedure";


export const appRouter = createTRPCRouter({
    videos: videosRouter,
    categories : categoriesRouter,
    studio: studioRouter,
    videoViews: videoViewsRouter
    
    
});

export type AppRouter = typeof appRouter ;