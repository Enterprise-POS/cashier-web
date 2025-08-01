'use server';

import { HTTPResult } from '@/_interface/HTTPResult';
import { LogInInput } from '@/_interface/LogInInput';
import { all_routes as routes } from '@/components/core/data/all_routes';
import { Constants } from '@/components/core/data/constant';
import { serverRoutes } from '@/components/core/data/serverRoutes';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function emailAndPasswordSignInAction(formData: FormData): Promise<HTTPResult<string>> {
	const email: FormDataEntryValue | null = formData.get('email');
	const password: FormDataEntryValue | null = formData.get('password');

	if (typeof email !== 'string' || email.trim() === '') {
		return { result: null, error: 'Please check input email' };
	}

	if (typeof password !== 'string' || password.trim().length < 8) {
		return { result: null, error: 'Please check input for password' };
	}

	try {
		const loginForm: LogInInput = { email: email.toString(), password: password.toString() };

		const response = await fetch(serverRoutes.signIn, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(loginForm),
		});

		if (!response.ok) {
			// convert error response1
			const body = await response.json();
			if (body.message === undefined)
				throw new Error('Unknown error, could not get response body, status code: ' + response.status);

			switch (response.status) {
				case 401:
				case 400:
					return { result: null, error: body.message };
				default:
					throw new Error('Unknown error, could not get response body, status code: ' + response.status);
			}
		}

		const body = await response.json();
		if (body?.data.token === undefined) {
			throw new Error('Unkown error, could not get response body, status code: ' + response.status);
		}

		// set the cookie
		const _cookies = await cookies();
		_cookies.set(Constants.CookieKey.enterprisePOS, body.data.token as string, {
			httpOnly: true,
			secure: true,
			maxAge: 60 * 60 * 24 * 7, // 1 week
			path: '/',
		});

		return { result: 'Sign in success', error: null };
	} catch (e) {
		const error = e as Error;
		return { result: null, error: error.message };
	}
}

export async function signOut(): Promise<HTTPResult<boolean>> {
	try {
		const _cookies = await cookies();
		_cookies.delete(Constants.CookieKey.enterprisePOS);
		return { result: true, error: null };
	} catch (error) {
		console.error(error);
		return { result: null, error: 'Unknown error while signing out' };
	}
}
