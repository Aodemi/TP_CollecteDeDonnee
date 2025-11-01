// Ctrl Auth V2 — register/login + hash + JWT
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { signToken } from "../../utils/jwt";
import { UserModel } from "../models/User";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[A-Za-z0-9._-]{3,30}$/;
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export async function register(req: Request, res: Response) {
  // valider les champs rapido
  const { email, username, password } = req.body || {};
  if (!EMAIL_RE.test(email || "")) return res.status(400).json({ message: "Invalid email", code: 400 });
  if (!USERNAME_RE.test(username || "")) return res.status(400).json({ message: "Invalid username", code: 400 });
  if (!PASSWORD_RE.test(password || "")) return res.status(400).json({ message: "Weak password", code: 400 });
  // check que l'email est unique
  const exists = await UserModel.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already exists", code: 409 });
  // hash le pwd
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ email, username, passwordHash, role: "user" });
  const { passwordHash: _, ...safe } = user.toObject();
  return res.status(201).json(safe);
}

export async function login(req: Request, res: Response) {
  // auth user + check pwd
  const { email, password } = req.body || {};
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials", code: 401 });
  const ok = await bcrypt.compare(password || "", user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials", code: 401 });
  // sign le JWT via util (lit secret/expiration depuis la config)
  const token = signToken({ id: (user._id as any).toString(), role: user.role, email: user.email, username: user.username });
  return res.json({ token });
}