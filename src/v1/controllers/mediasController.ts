import { Request, Response } from "express";
import { readDB, writeDB } from "../services/dbService";
import { v4 as uuidv4 } from "uuid";
import winston from "winston";

// Logger pour les opérations sur les médias
const opLogger = winston.createLogger({
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

// Lister tous les médias
export function listMedias(req: Request, res: Response) {
  const db = readDB();
  opLogger.info({ action: "list_medias", user: req.user?.id || null });
  res.json(db.medias);
}

// Récupérer un média par son ID
export function getMedia(req: Request, res: Response) {
  const id = req.params.id;
  const db = readDB();
  const media = db.medias.find((m: any) => m.id === id);
  // Si le média n'est pas trouvé, retourner une erreur 404
  if (!media) {
    opLogger.info({
      action: "get_media_not_found",
      id,
      user: req.user?.id || null,
    });
    return res.status(404).json({ error: "Media introuvable" });
  }
  opLogger.info({ action: "get_media", id, user: req.user?.id || null });
  res.json(media);
}

// Créer un nouveau média
export function createMedia(req: Request, res: Response) {
  const body = req.body;
  const db = readDB();
  const newMedia = { ...body, id: uuidv4() };
  db.medias.push(newMedia);
  writeDB(db);
  opLogger.info({
    action: "create_media",
    id: newMedia.id,
    user: req.user?.id || null,
  });
  res.status(201).json(newMedia);
}

// Mettre à jour un média existant
export function updateMedia(req: Request, res: Response) {
  const id = req.params.id;
  const body = req.body;
  const db = readDB();
  const idx = db.medias.findIndex((m: any) => m.id === id);

  // Si le média n'est pas trouvé, retourner une erreur 404
  if (idx === -1) {
    opLogger.info({
      action: "update_media_not_found",
      id,
      user: req.user?.id || null,
    });
    return res.status(404).json({ error: "Media introuvable" });
  }

  // Mettre à jour le média avec les nouvelles données
  const updated = { ...db.medias[idx], ...body, id };
  db.medias[idx] = updated;
  writeDB(db);
  opLogger.info({ action: "update_media", id, user: req.user?.id || null });
  res.json(updated);
}


// Supprimer un média par son ID
export function deleteMedia(req: Request, res: Response) {
  const id = req.params.id;
  const db = readDB();
  const idx = db.medias.findIndex((m: any) => m.id === id);
  
  // Si le média n'est pas trouvé, retourner une erreur 404
  if (idx === -1) {
    opLogger.info({
      action: "delete_media_not_found",
      id,
      user: req.user?.id || null,
    });
    return res.status(404).json({ error: "Media introuvable" });
  }
  const removed = db.medias.splice(idx, 1)[0];
  writeDB(db);
  opLogger.info({ action: "delete_media", id, user: req.user?.id || null });
  res.json({ message: "Supprimé", media: removed });
}
