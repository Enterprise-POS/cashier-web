import { Auth } from '@/_interface/Auth';
import { Constants } from '@/components/core/data/constant';
import { headers } from 'next/headers';

export async function getAuth(): Promise<Auth | null> {
	const headersList = await headers();
	const userAgent = headersList.get(Constants.HeaderKey.xEnterprisePayload);
	const userToken = headersList.get(Constants.HeaderKey.xEnterprisePayloadToken);
	if (userAgent === null || userToken === null) return null;

	try {
		// JSON.parse could throw an error, so handle just incase
		const payload = JSON.parse(userAgent);

		// because this is just converting json into object
		// some other data maybe available as well;
		// Auth will help developer which value current application use
		const auth = payload as Auth;
		auth.token = userToken;

		// This verification code below is currently our app use
		if (auth.name === undefined) return null;
		if (auth.sub === undefined) return null;
		if (auth.token === undefined) return null;

		return auth;
	} catch (error) {
		console.warn(error);
		return null;
	}
}
