import dotenv from 'dotenv';
dotenv.config();
export const config = {
	port: Number(process.env.PORT) || 3000,
	sslKeyPath: process.env.SSL_KEY_PATH || '',
	sslCertPath: process.env.SSL_CERT_PATH || '',
	sessionSecret: process.env.SESSION_SECRET || 'secret_par_defaut_pour_les_sessions',
	jwtSecret: process.env.JWT_SECRET || '',
	databaseUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/testTP',
	nodeEnv: process.env.NODE_ENV || 'development',
	isProduction: process.env.NODE_ENV === 'production',
};
