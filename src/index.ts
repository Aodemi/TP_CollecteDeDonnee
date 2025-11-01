// Entrypoint — pick HTTP/HTTPS et start le server
import dotenv from "dotenv";
dotenv.config({ override: true });

import { httpServer, httpsServer } from "./server";
import configLib from "config";
import type { ServerCfg } from "./config/config.type";
import { connectDB } from "./config/db";
import http from "http";

const srv = configLib.get<ServerCfg>("server");

let protocol: "http" | "https" = "http";
let port = srv.http.port;
let server: any = httpServer;

if (srv.https.enabled && httpsServer) {
	protocol = "https";
	port = srv.https.port;
	server = httpsServer;
}

connectDB().then(() => {
	server.listen(port, () => {
		console.log(`Serveur en écoute sur  : ${protocol}://localhost:${port}`);
	});

	if (srv.https.enabled && srv.https.redirectAllHttpToHttps) {
		// redirect tout le HTTP vers HTTPS
		const redirect = http.createServer((req, res) => {
			const host = req.headers.host ? req.headers.host.split(":")[0] : "localhost";
			res.writeHead(301, { Location: `https://${host}:${srv.https.port}${req.url}` });
			res.end();
		});
		redirect.on("error", (err: any) => {
			if ((err as any).code === "EADDRINUSE") {
				console.error(`Le port HTTP ${srv.http.port} pour la redirection est déjà utilisé.`);
				return;
			}
			console.error("Erreur de redirection HTTP:", err);
		});
		redirect.listen(srv.http.port, () => {
			console.log(`Serveur de redirection HTTP à l'écoute sur http://localhost:${srv.http.port}`);
		});
	}
});
