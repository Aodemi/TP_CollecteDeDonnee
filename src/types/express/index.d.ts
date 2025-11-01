import "express";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        id: string;
        role: "user" | "admin";
        email?: string;
      };
    }
  }
}

export {};
