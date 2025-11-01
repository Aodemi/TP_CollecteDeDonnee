import { Request, Response, NextFunction } from "express";

// Regex pour valider les champs
export const regexValidation = {
  title: /^[A-Za-z0-9 ]+$/,
  plateforme: /^[A-Za-z]+$/,
  duration: /^[1-9][0-9]*$/,
  status: /^(en_attente|en_cours|terminee)$/,
};

// Middleware pour valider le payload des médias (films et séries)
export function validateMediaPayload(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body = req.body;

  // Vérifier la présence du corps de la requête
  if (!body) return res.status(400).json({ error: "Payload manquant" });

  // title
  if (typeof body.title !== "string" || !regexValidation.title.test(body.title))
    return res
      .status(400)
      .json({ error: "title invalide (lettres, chiffres, espaces seulement)" });

  // genre
  if (typeof body.genre !== "string" || body.genre.trim() === "")
    return res.status(400).json({ error: "genre invalide" });

  // year
  if (
    typeof body.year !== "number" ||
    !Number.isInteger(body.year) ||
    body.year < 1800 ||
    body.year > new Date().getFullYear()
  )
    return res.status(400).json({ error: "year invalide" });

  // rating
  if (typeof body.rating !== "number" || body.rating < 0 || body.rating > 10)
    return res.status(400).json({ error: "rating invalide (0-10)" });

  // if film: duration
  if (body.type === "film") {
    if (
      typeof body.duration !== "number" ||
      !Number.isInteger(body.duration) ||
      body.duration <= 0
    )
      return res
        .status(400)
        .json({ error: "duration invalide (entier positif)" });
  }

  // if serie: status
  if (body.type === "serie") {
    if (
      typeof body.status !== "string" ||
      !regexValidation.status.test(body.status)
    )
      return res.status(400).json({ error: "status invalide" });
  }

  // Passer au middleware suivant si toutes les validations passent
  next();
}
