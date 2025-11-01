// Ctrl Users V2 — profil + admin
import { Request, Response } from "express";
import { UserModel } from "../models/User";

export async function me(req: Request, res: Response) {
  // renvoyer l'user courant
  const id = req.auth!.id;
  const user = await UserModel.findById(id).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "Not found", code: 404 });
  res.json(user);
}

export async function patchMe(req: Request, res: Response) {
  // update mon profil
  const id = req.auth!.id;
  const { username, favorites } = req.body || {};
  const update: any = {};
  if (typeof username === "string") update.username = username;
  if (Array.isArray(favorites)) update.favorites = favorites;
  const user = await UserModel.findByIdAndUpdate(id, update, { new: true }).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "Not found", code: 404 });
  res.json(user);
}

export async function getById(req: Request, res: Response) {
  // get par id (admin only)
  const { id } = req.params;
  const user = await UserModel.findById(id).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "Not found", code: 404 });
  res.json(user);
}
