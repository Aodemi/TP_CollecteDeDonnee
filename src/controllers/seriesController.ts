import { Request, Response } from "express";
import { readDB } from "../services/dbService";
import winston from "winston";

//  Logger pour les opérations sur les séries
const opLogger2 = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/operations.log" }),
  ],
});

// Lister tous les épisodes d'une série par son ID
export function listSeriesEpisodes(req: Request, res: Response) {
  const id = req.params.id;
  const db = readDB();
  const serie = db.medias.find((m: any) => m.id === id && m.type === "serie");
  
  // Si la série n'est pas trouvée, retourner une erreur 404
  if (!serie) {
    opLogger2.info({
      action: "list_serie_episodes_not_found",
      id,
      user: req.user?.id || null,
    });
    return res.status(404).json({ error: "Série introuvable" });
  }

  // Agréger tous les épisodes de toutes les saisons en ajoutant le numéro de saison à chaque épisode
  const episodes: any[] = [];
  for (const s of serie.saisons || []) {
    for (const ep of s.episodes || []) {
      episodes.push({ ...ep, seasonNumber: s.seasonNumber });
    }
  }
  // Logger l'opération
  opLogger2.info({
    action: "list_serie_episodes",
    id,
    user: req.user?.id || null,
    count: episodes.length,
  });
  res.json(episodes);
}
