// Routes notes V2 — add + moyennes
import { Router } from "express";
import * as ratings from "../controllers/ratings.controller";
import { requireAuth } from "../middlewares/authV2";

const router = Router();


router.post("/", requireAuth, ratings.addRating);
router.get("/avg/movie/:movieId", ratings.avgMovie);
router.get("/avg/series/:seriesId", ratings.avgSeries);

export default router;
