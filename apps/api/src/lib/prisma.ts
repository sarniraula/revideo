import { PrismaClient } from "../generated/prisma";

export const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
  accelerateUrl: process.env.PRISMA_ACCELERATE_URL!
});     