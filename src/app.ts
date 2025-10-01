import express from "express";
import morgan from "morgan";
import mediasRoutes from "./routes/mediasRoute";
import seriesRoutes from "./routes/seriesRoute";
import usersRoutes from "./routes/usersRoute";
import logsRoutes from "./routes/logsRoute";
import saisonsRoutes from "./routes/saisonsRoute";
import episodesRoutes from "./routes/episodesRoute";
import { errorHandler } from "./middlewares/errorHandler";
import { ensureDB } from "./services/dbService";

const app = express(); // Créer l'application Express
ensureDB(); // S'assurer que le fichier de base de données existe

// Middleware globaux
app.use(express.json());
// Logger les requêtes HTTP en mode développement
app.use(morgan("dev"));

// Routes
app.use("/api/medias", mediasRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/saisons", saisonsRoutes);
app.use("/api/episodes", episodesRoutes);

// Route de base pour vérifier que l'API fonctionne
app.get("/", (req, res) => res.json({ message: "TV-Tracker API" }));

// Middleware de gestion des erreurs
app.use(errorHandler);

export default app;
