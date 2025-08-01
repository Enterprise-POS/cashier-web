export const baseURL = process.env.MODE === 'prod' ? process.env.BASE_URL : process.env.DEV_URL;

export const serverRoutes = {
	signIn: `${baseURL}/api/v1/users/sign_in`,
	signUp: `${baseURL}/api/v1/users/sign_up`,
};
