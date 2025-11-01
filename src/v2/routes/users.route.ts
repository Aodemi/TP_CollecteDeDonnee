// Routes users V2 — profil + admin
import { Router } from "express";
import * as users from "../controllers/users.controller";
import { requireAuth, requireRole } from "../middlewares/authV2";

const router = Router();

router.get("/me", requireAuth, users.me);
router.patch("/me", requireAuth, users.patchMe);
router.get("/:id", requireAuth, requireRole("admin"), users.getById);

export default router;
