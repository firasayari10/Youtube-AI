
import {eq} from "drizzle-orm";

import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent
} from "@mux/mux-node/resources/webhooks"
import { headers } from "next/headers";
import { mux } from "@/lib/mux";
import { db } from "@/db";
import { videos } from "@/db/schema";
const SIGN_IN_SECRET = process.env.MUX_WEBHOOK_SECRET!;


type WehookEvent = | VideoAssetCreatedWebhookEvent |VideoAssetErroredWebhookEvent|VideoAssetReadyWebhookEvent|VideoAssetTrackReadyWebhookEvent

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
    }


    return new Response("Webhook received ",{status:200})
}