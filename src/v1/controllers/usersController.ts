import { Request, Response } from "express";
import { readDB } from "../services/dbService";
import winston from "winston";

//  Logger pour les opérations sur les séries
const opLogger3 = winston.createLogger({
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

// Lister les médias favoris d'un utilisateur par son ID
export function listUserMedias(req: Request, res: Response) {
  const uid = req.params.id;
  const db = readDB();
  const user = db.users.find((u: any) => u.id === uid);
  
  // Si l'utilisateur n'est pas trouvé, retourner une erreur 404
  if (!user) {
    opLogger3.info({
      action: "list_user_medias_not_found",
      uid,
      user: req.user?.id || null,
    });
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }

  // Logger l'opération
  opLogger3.info({
    action: "list_user_medias",
    uid,
    user: req.user?.id || null,
  });
  res.json(user.favorites || []);
}
