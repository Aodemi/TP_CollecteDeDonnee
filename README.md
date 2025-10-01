# TV-Tracker

## Installation

1. Clone le dépôt ou copie les fichiers sur ta machine.
2. Ouvre un terminal dans le dossier du projet.

3. Installe les dépendances :
```bash
npm install
```

## Lancer le projet

```bash
npm run dev
```

## Tester l’API

- Utilise Postman ou un autre client HTTP pour tester les routes.
- La collection Postman se trouve dans `Collections/Tv-Tracker API/postman_collection.json`
- Les données sont stockées dans `src/data/db.json`.
- Les logs sont dans le dossier `logs/`.

## Infos utiles

- Nécessite Node.js (v18+ recommandé).
- Les identifiants utilisateurs sont gérés dans le fichier JSON.
- Pour les routes protégées, ajoute l’en-tête `x-user-id` avec l’ID d’un admin (admin-1).
- Les modifications (ajout, suppression, édition) sont persistées automatiquement.
---