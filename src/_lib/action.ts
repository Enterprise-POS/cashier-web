'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { AddUserToTenant } from '@/_interface/AddUserToTenant';
import { ErrorResponse } from '@/_interface/ErrorResponse';
import { HTTPResult } from '@/_interface/HTTPResult';
import { HTTPSuccessResponse } from '@/_interface/HTTPSuccessResponse';
import { NewTenantInput } from '@/_interface/NewTenantInput';
import { RemoveUserFromTenantInput } from '@/_interface/RemoveUserFromTenantInput';
import { SignInInput } from '@/_interface/SignInInput';
import { SignUpInput } from '@/_interface/SignUpInput';
import { TenantDef } from '@/_interface/TenantDef';
import { UserDef } from '@/_interface/UserDef';
import { getAuth } from '@/_lib/auth';
import { all_routes } from '@/components/core/data/all_routes';
import { Constants } from '@/components/core/data/constant';
import { serverRoutes } from '@/components/core/data/serverRoutes';

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
		const loginForm: SignInInput = { email: email.toString(), password: password.toString() };

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

export async function emailAndPasswordSignUpAction(formData: FormData): Promise<HTTPResult<string>> {
	const name: FormDataEntryValue | null = formData.get('name');
	const email: FormDataEntryValue | null = formData.get('email');
	const password: FormDataEntryValue | null = formData.get('password');
	const password2: FormDataEntryValue | null = formData.get('password2');

	if (typeof name !== 'string' || name.trim() === '') {
		return { result: null, error: 'Please check input name' };
	}

	if (typeof email !== 'string' || email.trim() === '') {
		return { result: null, error: 'Please check input email' };
	}

	if (typeof password !== 'string' || password.trim().length < 8) {
		return { result: null, error: 'Please check input for password' };
	}

	if (typeof password2 !== 'string') {
		return { result: null, error: 'Please check input for password' };
	}

	if (password.toString() !== password2.toString()) {
		return { result: null, error: 'Password not matched, re-check password and password confirm column' };
	}

	try {
		const signUpInput: SignUpInput = {
			name: name.toString(),
			email: email.toString(),
			password: password.toString(),
		};

		const response = await fetch(serverRoutes.signUp, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(signUpInput),
		});
		if (!response.ok) {
			const body = await response.json();
			if (body.message === undefined)
				throw new Error('Unknown error, could not get response body, status code: ' + response.status);

			switch (response.status) {
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
			path: '/',
			sameSite: 'none',
			secure: true,
			maxAge: 60 * 60 * 24 * 7, // 1 week
		});

		return { result: 'Sing up success', error: null };
	} catch (e) {
		const error = e as Error;
		throw new Error(error.message);
	}
}

export async function signOut(): Promise<HTTPResult<boolean>> {
	try {
		const _cookies = await cookies();
		_cookies.delete(Constants.CookieKey.enterprisePOS);
		return { result: true, error: null };
	} catch (error) {
		console.error(error);
		return { result: false, error: 'Unknown error while signing out' };
	}
}

export async function getTenantWithUser(): Promise<HTTPResult<TenantDef[]>> {
	// getAuth() work here because we are at nextjs backend/server side
	const auth = await getAuth();
	if (auth === null) return { result: null, error: '[LOGIN] Must logged in' };

	// Here we are safe to say user already logged in,
	// then take
	const userId = auth.sub.toString();
	// const token = auth.token;

	try {
		// using cookie with next.js 13^
		// https://stackoverflow.com/questions/76274546/next-js-does-not-send-cookies-with-fetch-request-even-though-credentials-are-inc
		const userCookies = await cookies();
		const requestInit: RequestInit = { headers: { Cookie: userCookies.toString() } };

		// example url: http://localhost:8000/api/v1/tenants/999
		const response = await fetch(serverRoutes.getTenantWithUser.replace('<userId>', userId), requestInit);

		if (!response.ok) {
			let body: ErrorResponse;
			try {
				body = await response.json();
			} catch {
				body = {
					code: response.status,
					status: 'error',
					message: response.statusText,
				};
			}

			switch (response.status) {
				case 401:
					console.warn('[UNAUTHORIZED] login required');
					return { result: null, error: body.message };
				case 400:
					return { result: null, error: body.message };
				default:
					console.error(`[SERVER ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		const body = (await response.json()) as HTTPSuccessResponse<{ tenants: TenantDef[] }>;
		if (body?.data?.tenants === undefined) {
			return { result: null, error: 'Something wrong while parsing the data' };
		}

		return { result: body.data.tenants, error: null };
	} catch (e) {
		const error = e as Error;
		console.error(error);
		console.error(`Unknown error while get tenant with ID: ${auth.sub}`);
		return { result: null, error: `Unknown error while get tenant with ID: ${auth.sub}` };
	}
}

export async function newTenant(formData: FormData): Promise<HTTPResult<string>> {
	const ownerUserIdRaw = formData.get('owner-user-id');
	const tenantName = formData.get('tenant-name');

	// Convert and validate ownerUserId
	const ownerUserId = Number(ownerUserIdRaw);
	if (!ownerUserId || isNaN(ownerUserId)) {
		return { result: null, error: 'There is an error while submitting the form. Invalid owner user ID.' };
	}

	if (typeof tenantName !== 'string' || tenantName.trim() === '') {
		return { result: null, error: 'Please check input email' };
	}

	const newTenantInput: NewTenantInput = {
		name: tenantName,
		owner_user_id: ownerUserId,
	};

	try {
		const userCookies = await cookies();
		const requestInit: RequestInit = {
			method: 'POST',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(newTenantInput),
		};

		const response = await fetch(serverRoutes.newTenant, requestInit);

		if (!response.ok) {
			let body: ErrorResponse;
			try {
				body = await response.json();
			} catch {
				body = {
					code: response.status,
					status: 'error',
					message: response.statusText,
				};
			}

			switch (response.status) {
				case 401:
					return { result: null, error: body.message };
				case 403:
					return { result: null, error: body.message };
				case 400:
					return { result: null, error: body.message };
				default:
					console.error(`[SERVER ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		// Expected to get response 201
		revalidatePath('/');
		return { result: 'Created', error: null };
	} catch (e) {
		const error = e as Error;
		console.error(error);
		return { result: null, error: `Unknown error while create tenant with ID: ${ownerUserId}` };
	}
}

export async function getTenantMembers(tenantId: number): Promise<HTTPResult<UserDef[]>> {
	try {
		const userCookies = await cookies();

		const response = await fetch(serverRoutes.getTenantMembers.replace('<tenantId>', tenantId.toString()), {
			headers: { Cookie: userCookies.toString() },
			credentials: 'include',
		});

		if (!response.ok) {
			let body: ErrorResponse;
			try {
				body = await response.json();
			} catch {
				body = {
					code: response.status,
					status: 'error',
					message: response.statusText,
				};
			}

			switch (response.status) {
				case 401:
					return { result: null, error: body.message };
				case 403:
					return { result: null, error: body.message };
				case 400:
					return { result: null, error: body.message };
				default:
					console.error(`[SERVER ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		const body = (await response.json()) as HTTPSuccessResponse<{ members: UserDef[] }>;
		if (body?.data?.members === undefined) {
			return { result: null, error: 'Something wrong while parsing the data' };
		}

		return { result: body.data.members, error: null };
	} catch (e) {
		const error = e as Error;
		return { result: null, error: error.message };
	}
}

export async function addUserToTenant(formData: FormData): Promise<HTTPResult<boolean>> {
	const userId = formData.get('user-id');
	const performerId = formData.get('performer-id');
	const tenantId = formData.get('tenant-id');

	// Convert and validate ownerUserId
	const ownerUserId = Number(performerId);
	if (!ownerUserId || isNaN(ownerUserId)) {
		return { result: null, error: 'There is an error while submitting the form. Invalid owner user ID.' };
	}

	const convertedUserId = Number(userId);
	if (!convertedUserId || isNaN(convertedUserId)) {
		return { result: null, error: 'There is an error while submitting the form. Invalid new member ID' };
	}

	const convertedTenantId = Number(tenantId);
	if (!convertedTenantId || isNaN(convertedTenantId)) {
		return { result: null, error: 'There is an error while submitting the form. Invalid tenant ID' };
	}

	const addUserToTenantInput: AddUserToTenant = {
		performer_id: ownerUserId,
		tenant_id: convertedTenantId,
		user_id: convertedUserId,
	};

	try {
		const userCookies = await cookies();

		const requestInit: RequestInit = {
			method: 'POST',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(addUserToTenantInput),
		};

		const response = await fetch(serverRoutes.addUser, requestInit);

		if (!response.ok) {
			let body: ErrorResponse;
			try {
				body = await response.json();
			} catch {
				body = {
					code: response.status,
					status: 'error',
					message: response.statusText,
				};
			}

			switch (response.status) {
				case 401:
					return { result: null, error: body.message };
				case 403:
					return { result: null, error: body.message };
				case 400:
					return { result: null, error: body.message };
				default:
					console.error(`[SERVER ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		return { result: true, error: null };
	} catch (e) {
		const error = e as Error;
		return { result: null, error: error.message };
	}
}

export async function removeMemberFromTenant(userId: number, tenantId: number): Promise<HTTPResult<boolean>> {
	const auth = await getAuth();
	if (auth === null) {
		console.error('[ERROR] Fatal error user not logged in, but requesting to delete action');
		return { result: null, error: '[ERROR] Fatal error user not logged in, but requesting to delete action' };
	}

	if (auth.sub === userId) {
		return { result: null, error: 'This action is not yet allowed' };
	}

	const removeUserFromTenantInput: RemoveUserFromTenantInput = {
		user_id: userId, // To be remove from tenant
		tenant_id: tenantId,
		performer_id: auth.sub, // Who request this remove/delete action
	};

	try {
		const userCookies = await cookies();

		const requestInit: RequestInit = {
			method: 'DELETE',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(removeUserFromTenantInput),
		};

		const response = await fetch(serverRoutes.removeUserFromTenant, requestInit);

		if (!response.ok) {
			let body: ErrorResponse;
			try {
				body = await response.json();
			} catch {
				body = {
					code: response.status,
					status: 'error',
					message: response.statusText,
				};
			}

			switch (response.status) {
				case 401:
					return { result: null, error: body.message };
				case 403:
					return { result: null, error: body.message };
				case 400:
					return { result: null, error: body.message };
				default:
					console.error(`[SERVER ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		revalidatePath(all_routes.tenantMembers);
		return { result: true, error: null };
	} catch (e) {
		const error = e as Error;
		return { result: null, error: error.message };
	}
}
