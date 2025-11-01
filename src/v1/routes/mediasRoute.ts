import { Router } from "express";
import * as controller from "../controllers/mediasController";
import { validateMediaPayload } from "../middlewares/validation";
import { attachUser, requireAdmin } from "../middlewares/auth";

const router = Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(attachUser);

// Routes pour gérer les médias
router.get("/", controller.listMedias);

//  Récupérer un média par ID
router.get("/:id", controller.getMedia);

// Routes protégées nécessitant des droits admin
router.post("/", requireAdmin, validateMediaPayload, controller.createMedia);

// Mettre à jour un média existant
router.put("/:id", requireAdmin, validateMediaPayload, controller.updateMedia);

// Supprimer un média
router.delete("/:id", requireAdmin, controller.deleteMedia);

export default router;
