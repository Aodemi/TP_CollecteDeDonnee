// Ctrl Séries V2 — séries/saisons/épisodes
import { Request, Response } from "express";
import { SeriesModel } from "../models/Series";
import { SeasonModel } from "../models/Season";
import { EpisodeModel } from "../models/Episode";

export async function list(req: Request, res: Response) {
  // filtrer et list
  const { title, genre, status } = req.query as any;
  const q: any = {};
  if (title) q.title = { $regex: String(title), $options: "i" };
  if (genre) q.genres = String(genre);
  if (status) q.status = String(status);
  const items = await SeriesModel.find(q).sort({ createdAt: -1 });
  res.json(items);
}

export async function createSeries(req: Request, res: Response) {
  // valider et create la série
  const { title, genres = [], status } = req.body || {};
  if (typeof title !== "string" || !title) return res.status(400).json({ message: "Invalid title", code: 400 });
  if (!Array.isArray(genres)) return res.status(400).json({ message: "Invalid genres", code: 400 });
  if (!["ongoing", "ended"].includes(status)) return res.status(400).json({ message: "Invalid status", code: 400 });
  const serie = await SeriesModel.create({ title, genres, status });
  res.status(201).json(serie);
}

export async function createSeason(req: Request, res: Response) {
  // create une saison
  const { seriesId } = req.params;
  const { seasonNo, episodes = 0 } = req.body || {};
  if (Number(seasonNo) < 1) return res.status(400).json({ message: "Invalid seasonNo", code: 400 });
  const season = await SeasonModel.create({ seriesId, seasonNo, episodes });
  res.status(201).json(season);
}

export async function createEpisode(req: Request, res: Response) {
  // create un épisode
  const { seriesId, seasonId } = req.params;
  const { epNo, title, durationMin } = req.body || {};
  if (Number(epNo) < 1) return res.status(400).json({ message: "Invalid epNo", code: 400 });
  if (Number(durationMin) < 1 || Number(durationMin) > 300) return res.status(400).json({ message: "Invalid duration", code: 400 });
  const ep = await EpisodeModel.create({ seriesId, seasonId, epNo, title, durationMin });
  res.status(201).json(ep);
}

export async function listEpisodes(req: Request, res: Response) {
  // list les épisodes d'une saison
  const { seriesId, seasonId } = req.params;
  const { minDuration } = req.query as any;
  const q: any = { seriesId, seasonId };
  if (minDuration) q.durationMin = { $gte: Number(minDuration) };
  const items = await EpisodeModel.find(q).sort({ epNo: 1 });
  res.json(items);
}
