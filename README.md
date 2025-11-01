# TV-Tracker API – v1/v2

Deux versions de l’API sont exposées :
- v1 (héritée du TP1) en lecture seule: `/api/v1`
- v2 (cible TP2) professionnelle: `/api/v2`

Swagger UI:
- `/docs/v1` (v1 – deprecated)
- `/docs/v2` (v2 – OpenAPI 3)

## Installation

1) Prérequis: Node.js 18+, MongoDB en local (par défaut `mongodb://localhost:27017`)
2) Copier `.env.example` en `.env` et ajuster si nécessaire
3) Installer les dépendances

```powershell
npm install
```

## Configuration (environnements)

- Fichiers config: `config/default.json`, `config/test.json`, `config/production.json`, `config/custom-environment-variables.json`
- Variables: voir `.env.example` (ne committez pas vos secrets)

Champs clés (node-config):
- `db.uri`: URI MongoDB (surchargé par `MONGO_URI`)
- `security.jwt.secret` et `security.jwt.expiresIn` (le secret est requis – mappé depuis `JWT_SECRET`)
- `security.cors.origins[]`
- `security.rateLimit.{windowMs,max}`
- `server.{http,https,trustProxy}` (mappés par `HTTP_PORT`, `HTTPS_PORT`, etc.)

## Lancer en dev

```powershell
npm run dev
```

Le serveur démarre en HTTP et/ou HTTPS selon les réglages dans `.env` / `config/*`.

### HTTPS en développement

1. Générez des certificats locaux (auto-signés) en suivant `certs/README.md` (OpenSSL), ou utilisez mkcert pour un certificat de confiance locale.
2. Configurez votre `.env` (exemple recommandé):

```
HTTPS_ENABLED=true
HTTPS_PORT=3443
HTTP_PORT=3000
REDIRECT_HTTP_TO_HTTPS=true
SSL_KEY_PATH=./certs/key.pem
SSL_CERT_PATH=./certs/cert.pem
```

3. Démarrez:

```powershell
npm run dev
```

• Ouvrez https://localhost:3443 (certificat auto-signé → avertissement navigateur).
• Ou ouvrez http://localhost:3000 → redirigé vers HTTPS.

## Seed (jeu de données de base)

Option 1 — TypeScript seeder (recommandé):

```powershell
npm run seed
```

Le script crée: un admin `admin@example.com` / `Admin#123`, un utilisateur `user@example.com` / `User#123`, quelques films, une série (S1 avec 3 épisodes) et des évaluations.

Option 2 — Import JSON (mongoimport): voir `seed/*.json` pour les fichiers .json à importer dans mongoDB.

## Postman

Une collection prête à l’emploi est disponible: `Collections/Tv-Tracker API.postman_collection.json` (les endpoints v2, login → Bearer, etc.).

## V1 (lecture seule)

Endpoints principaux (deprecated):
- `GET /api/v1/medias`
- `GET /api/v1/medias/{id}`
- `GET /api/v1/series/{id}/episodes`
- `GET /api/v1/users/{id}/medias`
- `GET /api/v1/logs`

Les données v1 restent dans `src/data/db.json` et la journalisation dans `logs/`.

## V2 (JWT + rôles + MongoDB)

Auth & Users:
- `POST /api/v2/auth/register`
- `POST /api/v2/auth/login` (rate-limited) → renvoie `{ token }`
- `GET /api/v2/users/me` (JWT)
- `PATCH /api/v2/users/me` (JWT)
- `GET /api/v2/users/:id` (JWT admin)

Movies (admin pour mutations):
- `GET /api/v2/movies?title=&genre=&minYear=&maxDur=&page=&limit=`
- `POST /api/v2/movies`
- `GET /api/v2/movies/:id`
- `PATCH /api/v2/movies/:id`
- `DELETE /api/v2/movies/:id`

Series / Seasons / Episodes:
- `GET /api/v2/series?title=&genre=&status=`
- `POST /api/v2/series` (admin)
- `POST /api/v2/series/:seriesId/seasons` (admin)
- `POST /api/v2/series/:seriesId/seasons/:seasonId/episodes` (admin)
- `GET /api/v2/series/:seriesId/seasons/:seasonId/episodes?minDuration=`

Ratings (rate-limited):
- `POST /api/v2/ratings` (JWT)
- `GET /api/v2/ratings/avg/movie/:movieId`
- `GET /api/v2/ratings/avg/series/:seriesId`

Headers sécurité:
- Envoyer `Authorization: Bearer <token>` pour les endpoints protégés.

## Notes

- Les certificats auto-signés affichent un avertissement dans le navigateur (normal).
- Le style de ce README.md a été fait avec l'aide de l'IA