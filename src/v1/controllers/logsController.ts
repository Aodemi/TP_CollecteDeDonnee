import fs from "fs";
import path from "path";
import { Request, Response } from "express";

// Chemin vers le fichier de logs d'opérations
const opsPath = path.join(process.cwd(), "logs/operations.log");

// Récupérer la dernière entrée du fichier de logs d'opérations
export function getLastLog(req: Request, res: Response) {
    // Vérifier si le fichier existe
  if (!fs.existsSync(opsPath))
    return res.status(404).json({ error: "Aucun log d'opération trouvé" });
  
  // Lire le contenu du fichier
  const data = fs.readFileSync(opsPath, "utf-8");
  // Séparer les lignes, filtrer les vides et prendre la dernière
  const lines = data.trim().split(/\r?\n/).filter(Boolean);

  // Si aucune ligne, retourner une erreur 404
  if (lines.length === 0)
    return res.status(404).json({ error: "Aucun log d'opération trouvé" });
  
  // Prendre la dernière ligne
  const last = lines[lines.length - 1];

  // Tenter de parser la ligne en JSON, sinon retourner la ligne brute
  try {
    const parsed = JSON.parse(last);
    return res.json(parsed);
  } catch (err) {
    return res.json({ raw: last });
  }
}
