import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getUploadUrl } from "../services/s3.services";
import { jobQueue } from "../lib/queue";

// 1️⃣ Generate pre-signed URL
export async function createUploadUrl(req: Request, res: Response) {
  try {
    const { projectId, fileName, contentType } = req.body;
    
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    
    const userId = req.user.id; // auth middleware must set this

    // Create DB record first
    const video = await prisma.video.create({
      data: {
        projectId,
        status: "UPLOADING",
        originalUrl: `s3://${process.env.S3_BUCKET}/${fileName}`,
        userId,
      },
    });

    // Generate signed URL
    const uploadUrl = await getUploadUrl(
      `videos/${video.id}/${fileName}`,
      contentType
    );

    res.json({
      success: true,
      data: { uploadUrl, videoId: video.id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to generate upload URL" });
  }
}

// 2️⃣ Mark upload as complete
export async function completeUpload(req: Request, res: Response) {
  try {
    const { videoId } = req.body;

    // Update DB
    const video = await prisma.video.update({
      where: { id: videoId },
      data: { status: "UPLOADED" },
    });

    // Enqueue transcription job
    await jobQueue.add("TRANSCRIBE", { videoId });

    res.json({ success: true, data: video });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to complete upload" });
  }
}
