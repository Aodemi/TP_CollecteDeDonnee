// Middleware Auth V2 — check JWT + role
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import type { Role } from "../../types/role";
export { requireRole } from "../../middlewares/roles.middleware";

interface TokenPayload {
  id: string;
  role: Role;
  email?: string;
  iat?: number;
  exp?: number;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // extract le token Bearer
  const header = req.headers["authorization"] || req.headers["Authorization"];
  const value = Array.isArray(header) ? header[0] : header;
  if (!value || !value.startsWith("Bearer ")) {
    return res.status(401).json({ error: { message: "Missing or invalid Authorization header", status: 401 } });
  }

  const token = value.substring("Bearer ".length).trim();
  try {
    // verify le token et decode
    const decoded = verifyToken(token) as TokenPayload;
    if (!decoded?.id || !decoded?.role) {
      return res.status(401).json({ error: { message: "Invalid token payload", status: 401 } });
    }
    // attacher req.auth pour la suite
    req.auth = { id: decoded.id, role: decoded.role, email: decoded.email };
    return next();
  } catch (err) {
    return res.status(401).json({ error: { message: "Invalid or expired token", status: 401 } });
  }
}

export {};
