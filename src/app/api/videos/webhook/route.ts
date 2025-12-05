import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent,
    VideoAssetDeletedWebhookEvent
} from "@mux/mux-node/resources/webhooks";
import { headers } from "next/headers";
import { mux } from "@/lib/mux";
import { db } from "@/db";
import { videos } from "@/db/schema";

const SIGN_IN_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebhookEvent =
    | VideoAssetCreatedWebhookEvent
    | VideoAssetErroredWebhookEvent
    | VideoAssetReadyWebhookEvent
    | VideoAssetTrackReadyWebhookEvent
    | VideoAssetDeletedWebhookEvent;

export const POST = async (request: Request) => {
    if (!SIGN_IN_SECRET) throw new Error("Mux_webhook_secret is undefined");

    const headersPayload = headers();
    const muxSignature = (await headersPayload).get("mux-signature");
    if (!muxSignature) return new Response("No signature found", { status: 401 });

    const payload = await request.json();
    const body = JSON.stringify(payload);

    try {
        mux.webhooks.verifySignature(body, { "mux-signature": muxSignature }, SIGN_IN_SECRET);
    } catch {
        return new Response("Invalid signature", { status: 400 });
    }

    switch (payload.type as WebhookEvent["type"]) {
        case "video.asset.created": {
            const data = payload.data as VideoAssetCreatedWebhookEvent["data"];
            if (!data.upload_id) return new Response("No upload Id found", { status: 400 });

            await db.update(videos).set({
                muxAssetId: data.id,
                muxStatus: data.status
            }).where(eq(videos.muxUploadId, data.upload_id));
            break; // ✅ added break
        }

        case "video.asset.ready": {
            const data = payload.data as VideoAssetReadyWebhookEvent["data"];
            const playbackId = data.playback_ids?.[0].id;
            if (!data.upload_id) return new Response("missing upload Id", { status: 400 });
            if (!playbackId) return new Response("Missing playback Id", { status: 400 });

            const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
            const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
            const duration = data.duration ? Math.round(data.duration * 1000) : 0;

            const utapi = new UTApi();
            const [uploadedThumbnail, uploadedPreview] = await utapi.uploadFilesFromUrl([
                tempThumbnailUrl,
                tempPreviewUrl
            ]);

            if (!uploadedThumbnail.data || !uploadedPreview.data) {
                return new Response("failed to upload thumbnail or preview", { status: 500 });
            }

            const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data;
            const { key: previewKey, url: previewUrl } = uploadedPreview.data; // ✅ fixed previewUrl

            await db.update(videos).set({
                muxStatus: data.status,
                muxPlaybackId: playbackId,
                muxAssetId: data.id,
                thumbnailUrl,
                thumbnailKey,
                previewUrl,
                previewKey,
                duration
            }).where(eq(videos.muxUploadId, data.upload_id));
            break; // ✅ added break
        }

        case "video.asset.errored": {
            const data = payload.data as VideoAssetErroredWebhookEvent["data"];
            if (!data.upload_id) return new Response("Missing upload Id", { status: 400 });

            await db.update(videos).set({
                muxStatus: data.status
            }).where(eq(videos.muxUploadId, data.upload_id));
            break; // ✅ added break
        }

        case "video.asset.deleted": {
            const data = payload.data as VideoAssetDeletedWebhookEvent["data"];
            if (!data.upload_id) return new Response("Missing upload Id", { status: 400 });

            await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));
            break; // ✅ added break
        }

        case "video.asset.track.ready": {
            const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & { asset_id: string };
            if (!data.asset_id) return new Response("Missing asset Id", { status: 400 });

            await db.update(videos).set({
                muxTrackId: data.id,
                muxTrackStatus: data.status
            }).where(eq(videos.muxAssetId, data.asset_id));
            break; // ✅ added break
        }
    }

    return new Response("Webhook received", { status: 200 });
};
