import { Router } from "express";
import * as controller from "../controllers/seriesController";
import { attachUser } from "../middlewares/auth";

const router = Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(attachUser);

// Lister toutes les séries
router.get("/:id/episodes", controller.listSeriesEpisodes);

export default router;
