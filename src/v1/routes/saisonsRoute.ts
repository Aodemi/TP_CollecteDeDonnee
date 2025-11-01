import { Router } from "express";
import { attachUser, requireAdmin } from "../middlewares/auth";
import { addSeason } from "../controllers/saisonsController";

const router = Router();
// Appliquer le middleware d'authentification à toutes les routes
router.use(attachUser);

// Ajouter une saison (admin uniquement)
router.post("/", requireAdmin, addSeason);

export default router;
