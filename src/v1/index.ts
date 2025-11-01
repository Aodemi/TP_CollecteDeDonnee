import { Router } from "express";
import * as mediasController from "./controllers/mediasController";
import * as seriesController from "./controllers/seriesController";
import * as usersController from "./controllers/usersController";
import * as logsController from "./controllers/logsController";

// v1: lecture seule minimale - deprecated
const router = Router();

// Medias (GET only)
router.get("/medias", mediasController.listMedias);
router.get("/medias/:id", mediasController.getMedia);

// Series episodes (GET only)
router.get("/series/:id/episodes", seriesController.listSeriesEpisodes);

// Users favorites (GET only)
router.get("/users/:id/medias", usersController.listUserMedias);

// Logs (GET only)
router.get("/logs", logsController.getLastLog);

export default router;
