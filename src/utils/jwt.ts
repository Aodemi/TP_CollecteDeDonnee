import jwt, { SignOptions } from "jsonwebtoken";
import configLib from "config";
export type Role = "user" | "admin";
export interface TokenPayload {
  id: string;
  role: Role;
  email?: string;
  username?: string;
  iat?: number;
  exp?: number;
}

// Lire le secret JWT depuis la configuration (security.jwt.secret)
// Pas de valeur par défaut en dur: échoue si absent pour éviter les secrets en clair
export const JWT_SECRET = configLib.get<string>("security.jwt.secret");

export function signToken(payload: Omit<TokenPayload, "iat" | "exp">, options?: SignOptions) {
  const cfgExpires = configLib.has("security.jwt.expiresIn") ? (configLib.get("security.jwt.expiresIn") as any) : "1h";
  const expiresIn = (options?.expiresIn ?? cfgExpires) as any;
  const opts: SignOptions = { ...(options || {}), expiresIn };
  return jwt.sign(payload, JWT_SECRET as any, opts);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
