import { Router } from "express";
import { attachUser, requireAdmin } from "../middlewares/auth";
import { addEpisode, patchEpisode } from "../controllers/episodesController";

const router = Router();
router.use(attachUser);

// Ajouter un épisode (admin uniquement)
router.post("/", requireAdmin, addEpisode);
// Mettre à jour un épisode (admin uniquement)
router.patch("/:id", requireAdmin, patchEpisode);

export default router;
