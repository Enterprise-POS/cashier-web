declare global {
	namespace NodeJS {
		interface ProcessEnv {
			BASE_URL: string;
			MODE: string;
			DEV_URL: string;
			JWT_S: string;
		}
	}
}

export {};
