import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

interface InputType {
  userId: string;
  videoId: string;
  prompt: string;
}

export const { POST } = serve(async (context) => {
  const utapi = new UTApi();
  const input = context.requestPayload as InputType;
  const { videoId, userId, prompt } = input;

  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) throw new Error("Video not found");
    return existingVideo;
  });


  const response = await context.call<{
    data?: Array<{ url: string }>;
    error?: { message: string };
  }>("generate-thumbnail", {
    url: "https://api.openai.com/v1/images/generations",
    method: "POST",
    body: {
  prompt,
  n: 1,
  model: "gpt-image-1",
  size: "1024x1536"
},

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  });

  const body = response.body;

  if (body?.error) {
    throw new Error("OpenAI error: " + body.error.message);
  }

  const temporarythumbnailUrl = body?.data?.[0]?.url;
  if (!temporarythumbnailUrl) {
    throw new Error("bad request");
  }

  await context.run("cleanup-thumbnail", async () => {
    if (video.thumbnailKey) {
      await utapi.deleteFiles(video.thumbnailKey);

      await db
        .update(videos)
        .set({
          thumbnailKey: null,
          thumbnailUrl: null,
        })
        .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    }
  });

  
  const uploadedThumbnail = await context.run("upload-thumbnail", async () => {
    const { data, error } = await utapi.uploadFilesFromUrl(
      temporarythumbnailUrl
    );

    if (error) throw new Error(error.message);
    return data;
  });


  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        thumbnailKey: uploadedThumbnail.key,
        thumbnailUrl: uploadedThumbnail.url,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
