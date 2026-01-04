import { Request, Response, NextFunction } from "express";

// Temporary auth middleware for testing
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Mock user
  req.user = { id: "test-user-id" }; 
  next();
}
