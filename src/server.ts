import app from "./app";

const PORT = process.env.PORT || 3000; // Port par défaut 3000

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Lancement du serveur sur http://localhost:${PORT}`);
});
