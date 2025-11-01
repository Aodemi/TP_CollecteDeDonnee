import { NextFunction, Request, Response } from "express";
import type { Role } from "../types/role";
export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ error: { message: "Unauthorized", status: 401 } });
    }
    if (!roles.includes(req.auth.role as Role)) {
      return res.status(403).json({ error: { message: "Forbidden", status: 403 } });
    }
    return next();
  };
}

export default requireRole;