import { Router } from "express";
import * as controller from "../controllers/usersController";
import { attachUser } from "../middlewares/auth";

const router = Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(attachUser);

// Lister toutes les séries
router.get("/:id/medias", controller.listUserMedias);

export default router;
