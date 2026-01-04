import { PrismaClient } from "../generated/prisma/client";

export const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
  accelerateUrl: process.env.PRISMA_ACCELERATE_URL!
});     