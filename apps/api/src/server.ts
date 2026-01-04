import dotenv from "dotenv";
import path from "path";

// Load .env.local from workspace root (2 levels up from api/src)
dotenv.config({ path: path.resolve(__dirname, "../../../.env.local") });

import app from "./app";
import { prisma } from "./lib/prisma";
import { redis } from "./lib/redis";
import { jobQueue } from "./lib/queue";

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    // Verify Prisma
    await prisma.$connect();
    console.log("Prisma connected");

    // Verify Redis
    await redis.ping();
    console.log("Redis connected");

    // Verify Queue
    console.log(`Queue ready: ${jobQueue.name}`);

    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start", err);
    process.exit(1);
  }
}

bootstrap();
