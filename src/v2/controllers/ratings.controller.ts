// Ctrl Notes V2 — add rating + moyennes
import { Request, Response } from "express";
import mongoose from "mongoose";
import { RatingModel } from "../models/Rating";
import { EpisodeModel } from "../models/Episode";

export async function addRating(req: Request, res: Response) {
  // valider target + score
  const userId = req.auth!.id;
  const { target, targetId, score, review } = req.body || {};
  if (!['movie','episode'].includes(target)) return res.status(400).json({ message: 'Invalid target', code: 400 });
  const sc = Number(score);
  if (isNaN(sc) || sc < 0 || sc > 10) return res.status(400).json({ message: 'Invalid score', code: 400 });
  const r = await RatingModel.create({ userId, target, targetId, score: sc, review });
  res.status(201).json(r);
}

export async function avgMovie(req: Request, res: Response) {
  // agg des notes pour movie
  const { movieId } = req.params;
  const result = await RatingModel.aggregate([
    { $match: { target: 'movie', targetId: new mongoose.Types.ObjectId(movieId) } },
    { $group: { _id: '$targetId', avg: { $avg: '$score' }, count: { $sum: 1 } } }
  ]);
  if (!result.length) return res.json({ movieId, avg: null, count: 0 });
  res.json({ movieId, avg: result[0].avg, count: result[0].count });
}

export async function avgSeries(req: Request, res: Response) {
  // agg sur épisodes d'une série
  const { seriesId } = req.params;
  const result = await RatingModel.aggregate([
    { $match: { target: 'episode' } },
    { $lookup: { from: EpisodeModel.collection.name, localField: 'targetId', foreignField: '_id', as: 'ep' } },
    { $unwind: '$ep' },
    { $match: { 'ep.seriesId': new mongoose.Types.ObjectId(seriesId) } },
    { $group: { _id: '$ep.seriesId', avg: { $avg: '$score' }, count: { $sum: 1 } } }
  ]);
  if (!result.length) return res.json({ seriesId, avg: null, count: 0 });
  res.json({ seriesId, avg: result[0].avg, count: result[0].count });
}
