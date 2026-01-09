'use server';
import { cookies } from 'next/headers';

import { ErrorResponse } from '@/_interface/ErrorResponse';
import { HTTPResult } from '@/_interface/HTTPResult';
import { HTTPSuccessResponse } from '@/_interface/HTTPSuccessResponse';
import { StoreDef } from '@/_interface/StoreDef';
import { serverRoutes } from '@/components/core/data/serverRoutes';

export async function getStores(
	tenantId: number,
	page: number,
	limit: number
): Promise<HTTPResult<{ count: number; storeDefs: StoreDef[] }>> {
	const params = new URLSearchParams({
		limit: limit.toString(),
		page: page.toString(),
		include_non_active: 'TRUE',
	});
	const paramsString = `?${params.toString()}`;

	try {
		const userCookies = await cookies();

		const requestInit: RequestInit = {
			credentials: 'include',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
		};

		const response = await fetch(
			`${serverRoutes.getStores.replace('<tenantId>', tenantId.toString())}${paramsString}`,
			requestInit
		);
		if (!response.ok) {
			let body: ErrorResponse;
			try {
				body = await response.json();
			} catch {
				body = {
					code: response.status,
					status: 'error',
					message: `[DEV] Fatal error while parsing message: ${response.statusText}`,
				};
			}

			switch (response.status) {
				case 400:
				case 401:
				case 403:
					return { result: null, error: body.message };
				default:
					console.error(`[SERVER ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		// Maybe there are more information from the request
		// example request
		/*
			{
			"code": 200,
			"status": "success",
			"data": {
					"count": 1,
					"limit": 10,
					"page": 1,
					"requested_by_tenant_id": 333,
					"stores": [
							{
									"id": 52,
									"name": "From BE",
									"created_at": "2025-10-23T07:17:34.355632Z",
									"is_active": true,
									"tenant_id": 333
							}
					]
			}
		}
		*/
		const storeResponse: HTTPSuccessResponse<{ stores: StoreDef[]; count: number }> = await response.json();
		const storeDefs = storeResponse.data.stores;
		const count = storeResponse.data.count;

		return { result: { storeDefs, count }, error: null };
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}

		console.error(error);
		return { result: null, error: 'Unknown error' };
	}
}

export async function createNewStore(storeName: string, tenantId: number): Promise<HTTPResult<StoreDef>> {
	try {
		const reqBody = {
			name: storeName,
		};

		const userCookies = await cookies();

		const requestInit: RequestInit = {
			method: 'POST',
			credentials: 'include',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
		};

		const response = await fetch(serverRoutes.createNewStore.replace('<tenantId>', tenantId.toString()), requestInit);
		if (!response.ok) {
			let body: ErrorResponse;
			try {
				body = await response.json();
			} catch {
				body = {
					code: response.status,
					status: 'error',
					message: `[DEV] Fatal error while parsing message: ${response.statusText}`,
				};
			}

			switch (response.status) {
				case 400:
				case 401:
				case 403:
					return { result: null, error: body.message };
				default:
					console.error(`[SERVER ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		const storeResponse: HTTPSuccessResponse<{ created_store: StoreDef }> = await response.json();
		const storeDef = storeResponse.data.created_store;

		return { result: storeDef, error: null };
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}

		console.error(error);
		return { result: null, error: 'Unknown error' };
	}
}

export async function setStoreActivate(tenantId: number, storeId: number, setInto: boolean): Promise<HTTPResult<void>> {
	try {
		const reqBody = {
			store_id: storeId,
			set_into: setInto,
		};

		const userCookies = await cookies();

		const requestInit: RequestInit = {
			method: 'PUT',
			credentials: 'include',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
		};

		const response = await fetch(serverRoutes.setStoreActivate.replace('<tenantId>', tenantId.toString()), requestInit);
		if (!response.ok) {
			let body: ErrorResponse;
			try {
				body = await response.json();
			} catch {
				body = {
					code: response.status,
					status: 'error',
					message: `[DEV] Fatal error while parsing message: ${response.statusText}`,
				};
			}

			switch (response.status) {
				case 400:
				case 401:
				case 403:
					return { result: null, error: body.message };
				default:
					console.error(`[SERVER ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		// Accepted 202
		return { result: null, error: null };
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}

		console.error(error);
		return { result: null, error: 'Unknown error' };
	}
}
