import express from "express";
import { createUploadUrl, completeUpload } from "../controllers/video.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// Generate S3 upload URL
router.post("/upload-url", authMiddleware, createUploadUrl);

// Mark video as uploaded
router.post("/complete", authMiddleware, completeUpload);

export default router;
