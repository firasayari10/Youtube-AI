
import {eq} from "drizzle-orm";

import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent,
    VideoAssetDeletedWebhookEvent
} from "@mux/mux-node/resources/webhooks"
import { headers } from "next/headers";
import { mux } from "@/lib/mux";
import { db } from "@/db";
import { videos } from "@/db/schema";
const SIGN_IN_SECRET = process.env.MUX_WEBHOOK_SECRET!;


type WehookEvent = | VideoAssetCreatedWebhookEvent |VideoAssetErroredWebhookEvent|VideoAssetReadyWebhookEvent|VideoAssetTrackReadyWebhookEvent|VideoAssetDeletedWebhookEvent

export const POST =async(request:Request)=>{
    if(!SIGN_IN_SECRET)
    {
        throw new Error("Mux_webhook_secret is undefined")
    }
    const headersPayload = await headers()
    const muxSignature = headersPayload.get("mux-signature");

    if(!muxSignature)
    {
        return new Response("No signature found",{status:401})
    }
    const paylaod = await request.json();
    const body = JSON.stringify(paylaod);

    mux.webhooks.verifySignature(
        body,
        {
            "mux-signature":muxSignature
        },
        SIGN_IN_SECRET
    );

    switch (paylaod.type as WehookEvent["type"] ){
        case "video.asset.created":{
            const data = paylaod.data as VideoAssetReadyWebhookEvent["data"];
            if(!data.upload_id)
            {
                return new Response ("No upload Id found",{status:400})
            }

            await db.update(videos).set({
                muxAssetId:data.id,
                muxStatus:data.status
            }).where(eq(videos.muxUploadId,data.upload_id))

        }
        case"video.asset.ready":{
            const data = paylaod.data as VideoAssetReadyWebhookEvent["data"];
            const  playbackId = data.playback_ids?.[0].id;
            if(!data.upload_id){
                return new Response("missing upload Id",{status:400})
            }
            if(!playbackId){
                return new Response("Missiing playback Id",{status:400})
            }

            const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg` ;
            const previewUrl = `https://image.mux.com/${playbackId}/animated.gif` ;
            const duration = data.duration ? Math.round(data.duration * 1000):0;

            await db.update(videos).set({
                muxStatus:data.status,
                muxPlaybackId:playbackId,
                muxAssetId:data.id,
                thumbnailUrl,
                previewUrl,
                duration
            })
            .where(eq(videos.muxUploadId,data.upload_id));
            break;
        }
        case "video.asset.errored":{
            const data = paylaod.data as VideoAssetErroredWebhookEvent["data"];
            if(!data.upload_id){
                return new Response ("Missing upload Id",{status:400})
            }
            await db.update(videos).set({
                muxStatus:data.status
            })
            .where(eq(videos.muxUploadId, data.upload_id));
            break;
        }
        case "video.asset.deleted":{
            const data = paylaod.data as VideoAssetDeletedWebhookEvent["data"];
            if(!data.upload_id){
                return new Response ("Missing upload Id",{status:400})
            }
            await db.delete(videos).where(eq(videos.muxUploadId,data.upload_id))
        }
    }


    return new Response("Webhook received ",{status:200})
}