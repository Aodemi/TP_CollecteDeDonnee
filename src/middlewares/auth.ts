import { Request, Response, NextFunction } from "express";
import { readDB } from "../services/dbService";

// Étendre l'interface Request pour inclure user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}


// Middleware pour attacher l'utilisateur à la requête si le header x-user-id est présent
export function attachUser(req: Request, res: Response, next: NextFunction) {
  const uid = req.header("x-user-id"); // Récupérer l'ID utilisateur depuis le header
  if (!uid) return next();
  const db = readDB();
  const user = db.users.find((u: any) => u.id === uid);

  // Si l'utilisateur est trouvé, l'attacher à la requête
  if (user) {
    req.user = { id: user.id, role: user.role, email: user.email };
  }
  // Passer au middleware suivant
  next();
}

// Middleware pour protéger les routes nécessitant une authentification
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  
  // Vérifier si l'utilisateur est authentifié et a le rôle admin
  if (!req.user)
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  // Vérifier le rôle admin
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Niveau de permission insuffisant" });
  next();
}
