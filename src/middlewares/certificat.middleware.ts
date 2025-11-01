import fs from "fs";
import path from "path";

export interface CertificateOptions {
	key: Buffer;
	cert: Buffer;
}

export function loadCertificate(): CertificateOptions | null {
	const keyPath = process.env.SSL_KEY_PATH || path.join(__dirname, "../../certs/key.pem");
	const certPath = process.env.SSL_CERT_PATH || path.join(__dirname, "../../certs/cert.pem");

	if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
		return null;
	}

	return {
		key: fs.readFileSync(keyPath),
		cert: fs.readFileSync(certPath),
	};
}

export default loadCertificate;
