import { Auth } from '@/_interface/Auth';
import { headers } from 'next/headers';

export async function getAuth(): Promise<Auth | null> {
	const headersList = await headers();
	const userAgent = headersList.get('x-enterprise-payload');
	if (userAgent === null) return null;

	try {
		// JSON.parse could throw an error, so handle just incase
		const payload = JSON.parse(userAgent);

		const auth = payload as Auth;
		if (auth.name === undefined) return null;
		if (auth.sub === undefined) return null;

		return auth;
	} catch (error) {
		console.warn(error);
		return null;
	}
}
