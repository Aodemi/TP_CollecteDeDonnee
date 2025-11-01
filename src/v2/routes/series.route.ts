// Routes séries V2 — create/list + admin
import { Router } from "express";
import * as series from "../controllers/series.controller";
import { requireAuth, requireRole } from "../middlewares/authV2";

const router = Router();

router.get("/", series.list);
router.post("/", requireAuth, requireRole("admin"), series.createSeries);
router.post("/:seriesId/seasons", requireAuth, requireRole("admin"), series.createSeason);
router.post("/:seriesId/seasons/:seasonId/episodes", requireAuth, requireRole("admin"), series.createEpisode);
router.get("/:seriesId/seasons/:seasonId/episodes", series.listEpisodes);

export default router;
