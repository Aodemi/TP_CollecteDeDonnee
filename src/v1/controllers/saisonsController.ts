import { Request, Response } from "express";
import { readDB, writeDB } from "../services/dbService";
import { v4 as uuidv4 } from "uuid";

// Ajouter une nouvelle saison à une série
export function addSeason(req: Request, res: Response) {
  const { serieId, seasonNumber, releaseDate } = req.body;
  // Valider la présence des champs requis
  if (!serieId || !seasonNumber || !releaseDate) {
    return res
      .status(400)
      .json({ error: "serieId, seasonNumber et releaseDate requis" });
  }

  // Lire la base de données
  const db = readDB();
  const serie = db.medias.find(
    (m: any) => m.id === serieId && m.type === "serie"
  );

  // Si la série n'est pas trouvée, retourner une erreur 404
  if (!serie) return res.status(404).json({ error: "Série introuvable" });

  // Créer une nouvelle saison
  const newSeason = { seasonNumber, releaseDate, episodes: [], id: uuidv4() };
  serie.saisons = serie.saisons || [];
  serie.saisons.push(newSeason);
  writeDB(db);

  res.status(201).json(newSeason);
}
