import express from "express";
import v1Router from "../v1";
import v2Router from "../v2";
const router = express.Router();

router.use("/api/v1", v1Router);
router.use("/api/v2", v2Router);

export default router;
