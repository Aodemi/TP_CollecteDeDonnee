import { Request, Response, NextFunction } from "express";
import winston from "winston";

// Configurer le logger avec Winston
const errorLogger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/errors.log" }),
  ],
});

// Middleware de gestion des erreurs
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  errorLogger.error({
    message: err.message || "Erreur serveur",
    stack: err.stack,
    route: req.originalUrl,
  });
  res.status(500).json({ error: "Erreur interne" });
}
