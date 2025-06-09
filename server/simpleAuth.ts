import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Simple mock session for local development
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        isAdmin: boolean;
      };
    }
  }
}

export function setupSimpleAuth(app: Express) {
  // Mock authentication middleware for local development
  app.use((req: Request, res: Response, next: NextFunction) => {
    // For local development, simulate an admin user
    req.user = {
      id: "admin-user",
      isAdmin: true
    };
    next();
  });

  // Simple auth routes
  app.get('/api/auth/user', async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/logout', (req: Request, res: Response) => {
    req.user = undefined;
    res.json({ message: "Logged out" });
  });
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};