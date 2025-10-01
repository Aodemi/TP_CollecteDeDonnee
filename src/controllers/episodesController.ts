import { Request, Response } from "express";
import { readDB, writeDB } from "../services/dbService";
import { v4 as uuidv4 } from "uuid";

// Ajouter un nouvel épisode à une saison
export function addEpisode(req: Request, res: Response) {
    //récupérer les données du corps de la requête
  const { saisonId, title, duration, episodeNumber, watched } = req.body;
  if (!saisonId || !title || !duration || !episodeNumber) {
    return res
      .status(400)
      .json({ error: "saisonId, title, duration et episodeNumber requis" });
  }
  // Lire la base de données
  const db = readDB();
  let saisonFound = null;
  // Trouver la saison par son ID
  for (const media of db.medias) {
    if (media.type === "serie") {
      saisonFound = media.saisons?.find((s: any) => s.id === saisonId);
      if (saisonFound) {
        break; // sortir de la boucle si la saison est trouvée
      }
    }
  }
  // Si la saison n'est pas trouvée, retourner une erreur 404
  if (!saisonFound)
    return res.status(404).json({ error: "Saison introuvable" });
  
  // Créer un nouvel épisode
  const newEpisode = {
    id: uuidv4(),
    title,
    duration,
    episodeNumber,
    watched: watched || false, // par défaut à false
  };

    // Ajouter le nouvel épisode à la saison trouvée
  saisonFound.episodes.push(newEpisode);
  writeDB(db);

    // Retourner le nouvel épisode avec un statut 201 (créé)
  res.status(201).json(newEpisode);
}
// Mettre à jour le statut "watched" d'un épisode
export function patchEpisode(req: Request, res: Response) {
  const { id } = req.params;
  const { watched } = req.body;

    // Valider la présence et le type du champ "watched"
  if (typeof watched !== "boolean")
    return res.status(400).json({ error: "champ watched requis (boolean)" });

  // Lire la base de données
  const db = readDB();
  let episodeFound = null;
  // Trouver l'épisode par son ID
  for (const media of db.medias) {
    if (media.type === "serie") {
        // parcourir les saisons pour trouver l'épisode
      for (const saison of media.saisons || []) {
        episodeFound = saison.episodes.find((ep: any) => ep.id === id);
        if (episodeFound) break;
      }
      if (episodeFound) break;
    }
  }

  // Si l'épisode n'est pas trouvé, retourner une erreur 404
  if (!episodeFound)
    return res.status(404).json({ error: "Épisode non trouvé" });
  
  // Mettre à jour le statut "watched"
  episodeFound.watched = watched;
  writeDB(db);

  // Retourner l'épisode mis à jour
  res.json(episodeFound);
}
