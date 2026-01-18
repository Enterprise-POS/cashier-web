import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { all_routes as routes } from '@/components/core/data/all_routes';
import { Constants } from '@/components/core/data/constant';

const publicRoute = [routes.login, routes.register];
const protectedFromSignedInUser = [routes.login, routes.register];

const secretKey = process.env.JWT_S;
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
	// console.log('MIDDLEWARE', request.nextUrl.pathname);

	try {
		// No cookie means logged out state
		const token = request.cookies.get(Constants.CookieKey.enterprisePOS)?.value ?? '';
		if (token === '') {
			// Logged out user could access unprotected route
			if (publicRoute.includes(request.nextUrl.pathname)) {
				return NextResponse.next();
			} else {
				// Any other route that not defined will be redirected to login page
				return NextResponse.redirect(new URL(routes.login, request.url));
			}
		}

		// Verify token signature & expiration
		// if the token not valid, jwtVerify will throw an error
		const { payload } = await jwtVerify(token, encodedKey, { algorithms: ['HS256'] });

		// Logged in user should not access again login/register page
		if (protectedFromSignedInUser.includes(request.nextUrl.pathname)) {
			return NextResponse.redirect(new URL(routes.index, request.url));
		}
		// console.log(payload);
		// console.log(protectedHeader);

		// Clone the request and attach custom header
		const requestHeaders = new Headers(request.headers);
		requestHeaders.set(Constants.HeaderKey.xEnterprisePayload, JSON.stringify(payload));
		requestHeaders.set(Constants.HeaderKey.xEnterprisePayloadToken, token);

		// Anything beyond could go through
		return NextResponse.next({ request: { headers: requestHeaders } });
	} catch (e: unknown) {
		const error = e as Error;
		console.warn(`Error while validating JWT ${error.message}`);
		return NextResponse.redirect(new URL(routes.login, request.url));
	}
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|sitemap.xml|robots.txt).*)'],
};
