import fs from "fs";
import path from "path";

// Chemin vers le fichier de base de données JSON
const dbPath = path.join(__dirname, "../../data/db.json");

//  Créer le fichier de base de données s'il n'existe pas
export function ensureDB() {
  if (!fs.existsSync(dbPath)) {
    const initial = {
      users: [],
      medias: [],
    };
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2));
  }
}

// Lire le contenu de la base de données
export function readDB(): any {
  ensureDB(); // s'assurer que le fichier existe
  const raw = fs.readFileSync(dbPath, "utf-8");
  // Tenter de parser le contenu JSON, sinon réinitialiser la base de données
  try {
    return JSON.parse(raw);
  } catch (err) {
    const initial = { users: [], medias: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2));
    return initial;
  }
}

// Écrire des données dans la base de données
export function writeDB(data: any): void {
  ensureDB(); // s'assurer que le fichier existe
  // Écrire de manière atomique en utilisant un fichier temporaire
  const tmpPath = dbPath + ".tmp";
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
  fs.renameSync(tmpPath, dbPath);
}
