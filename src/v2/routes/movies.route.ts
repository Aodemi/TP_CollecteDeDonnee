// Routes films V2 — public + admin
import { Router } from "express";
import * as movies from "../controllers/movies.controller";
import { requireAuth, requireRole } from "../middlewares/authV2";

const router = Router();

router.get("/", movies.list);
router.post("/", requireAuth, requireRole("admin"), movies.create);
router.get("/:id", movies.getById);
router.patch("/:id", requireAuth, requireRole("admin"), movies.patch);
router.delete("/:id", requireAuth, requireRole("admin"), movies.remove);

export default router;
