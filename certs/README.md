Générer un certificat auto-signé (pour le Développement)
Pour le développement, vous pouvez générer un certificat auto-signé à l’aide de openssl :

openssl genpkey -algorithm RSA -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
Cela génère deux fichiers :

key.pem : La clé privée.
cert.pem : Le certificat.

Ajoutez les au dossier certs