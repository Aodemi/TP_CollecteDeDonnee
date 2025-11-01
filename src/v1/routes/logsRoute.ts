import { Router } from "express";
import * as controller from "../controllers/logsController";

const router = Router();

// Récupérer le dernier log
router.get("/", controller.getLastLog);

export default router;
