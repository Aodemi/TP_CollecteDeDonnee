// Ctrl Films V2 — CRUD simple
import { Request, Response } from "express";
import { MovieModel } from "../models/Movie";

export async function list(req: Request, res: Response) {
  // build le filtre
  const { title, genre, minYear, maxDur, page = 1, limit = 10 } = req.query as any;
  const q: any = {};
  if (title) q.title = { $regex: String(title), $options: "i" };
  if (genre) q.genres = String(genre);
  if (minYear) q.releaseDate = { ...(q.releaseDate || {}), $gte: new Date(`${minYear}-01-01`) };
  if (maxDur) q.durationMin = { ...(q.durationMin || {}), $lte: Number(maxDur) };

  // pagination quick
  const p = Math.max(1, Number(page));
  const l = Math.min(100, Math.max(1, Number(limit)));

  const [items, total] = await Promise.all([
    MovieModel.find(q)
      .skip((p - 1) * l)
      .limit(l)
      .sort({ createdAt: -1 }),
    MovieModel.countDocuments(q),
  ]);

  res.json({ items, total, page: p, pages: Math.ceil(total / l) });
}

export async function create(req: Request, res: Response) {
  // valider et créer le movie
  const { title, genres = [], synopsis, releaseDate, durationMin } = req.body || {};
  if (typeof title !== "string" || title.length < 1 || title.length > 200) return res.status(400).json({ message: "Invalid title", code: 400 });
  if (!Array.isArray(genres)) return res.status(400).json({ message: "Invalid genres", code: 400 });
  if (durationMin == null || Number(durationMin) < 1 || Number(durationMin) > 600) return res.status(400).json({ message: "Invalid duration", code: 400 });
  const movie = await MovieModel.create({ title, genres, synopsis, releaseDate, durationMin });
  res.status(201).json(movie);
}

export async function getById(req: Request, res: Response) {
  const movie = await MovieModel.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: "Not found", code: 404 }); // 404 si pas trouvé
  res.json(movie);
}

export async function patch(req: Request, res: Response) {
  const { id } = req.params;
  const update = req.body || {};
  const movie = await MovieModel.findByIdAndUpdate(id, update, { new: true });
  if (!movie) return res.status(404).json({ message: "Not found", code: 404 }); // idem 404
  res.json(movie);
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params;
  const movie = await MovieModel.findByIdAndDelete(id);
  if (!movie) return res.status(404).json({ message: "Not found", code: 404 }); // delete ok sinon 404
  res.status(204).send();
}
