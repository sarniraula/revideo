import express from "express";
import cors from "cors";
import videoRoutes from "./routes/video.routes";

const app = express();

// Core middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (optional but useful)
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// VIDEO routes
app.use("/videos", videoRoutes);

export default app;
