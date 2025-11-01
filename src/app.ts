// App Express — middlewares/docs/routes
import express from "express";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";
import errorMiddleware from "./middlewares/error.middleware";
import { ensureDB } from "./v1/services/dbService";
import routes from "./routes";
import cors from "cors";
import rateLimit from "express-rate-limit";
import configLib from "config";
import logger from "./utils/logger";

const app = express();
ensureDB();

app.use(express.json());

app.use((req, _res, next) => {
	logger.info(`${req.method} ${req.url}`);
	next();
});

// CORS configurable via config
const corsOrigins = (configLib.has("security.cors.origins")
	? (configLib.get("security.cors.origins") as string[])
	: ["http://localhost:4200", "http://localhost:3000"]) as string[];
app.use(
	cors({
		origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
			if (!origin) return callback(null, true);
			return callback(null, corsOrigins.includes(origin));
		},
		credentials: true,
	})
);

// Rate limit sur endpoints
const rlWindow = Number(configLib.has("security.rateLimit.windowMs") ? configLib.get("security.rateLimit.windowMs") : 15 * 60 * 1000);
const rlMax = Number(configLib.has("security.rateLimit.max") ? configLib.get("security.rateLimit.max") : 100);
const loginLimiter = rateLimit({ windowMs: rlWindow, max: rlMax, standardHeaders: true, legacyHeaders: false });
const ratingsLimiter = rateLimit({ windowMs: rlWindow, max: rlMax, standardHeaders: true, legacyHeaders: false });
app.use("/api/v2/auth/login", loginLimiter);
app.use("/api/v2/ratings", ratingsLimiter);

// Swagger docs v1/v2
const docsDir = path.join(__dirname, "../docs");
const v1Spec = JSON.parse(fs.readFileSync(path.join(docsDir, "swagger-v1.json"), "utf-8"));
const v2Spec = JSON.parse(fs.readFileSync(path.join(docsDir, "swagger-v2.json"), "utf-8"));
app.use("/docs/v1", swaggerUi.serveFiles(v1Spec, {}), swaggerUi.setup(v1Spec));
app.use("/docs/v2", swaggerUi.serveFiles(v2Spec, {}), swaggerUi.setup(v2Spec));
app.use("/docs", express.static(docsDir));

// Mount toutes les routes
app.use(routes);

app.get("/", (req, res) => res.json({ message: "TV-Tracker API", versions: ["v1", "v2"] }));

// Error handling
app.use(errorMiddleware);

export default app;
