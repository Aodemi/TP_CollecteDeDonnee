// Regroupe les routes V2 sous /api/v2
import { Router } from "express";
import authRoutes from "./routes/auth.route";
import usersRoutes from "./routes/users.route";
import moviesRoutes from "./routes/movies.route";
import seriesRoutes from "./routes/series.route";
import ratingsRoutes from "./routes/ratings.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/movies", moviesRoutes);
router.use("/series", seriesRoutes);
router.use("/ratings", ratingsRoutes);

export default router;
