declare global {
	namespace NodeJS {
		interface ProcessEnv {
			BASE_URL: string;
			API_VERSION: string;
			MODE: string;
			DEV_URL: string;
			JWT_S: string;
		}
	}
}

export {};
