'use server';

import { cookies } from 'next/headers';

import { ErrorResponse } from '@/_interface/ErrorResponse';
import { HTTPResult } from '@/_interface/HTTPResult';
import { HTTPSuccessResponse } from '@/_interface/HTTPSuccessResponse';
import { StoreStockDef, StoreStockV2Def } from '@/_interface/StoreStockDef';
import { serverRoutes } from '@/components/core/data/serverRoutes';
import { TransferStockRequest } from '@/_interface/TransferStock';
import { convertTo } from '@/_lib/utils';

export async function getAllV2(
	storeId: number,
	tenantId: number,
	page: number,
	limit: number,
	nameQuery: string
): Promise<HTTPResult<{ count: number; storeStockDefs: StoreStockV2Def[] }>> {
	const targetURL = serverRoutes.storeStocksGetAllV2.replace('<tenantId>', tenantId.toString());
	const url = new URL(targetURL);
	const params: URLSearchParams = url.searchParams;
	params.set('page', page.toString());
	params.set('limit', limit.toString());
	params.set('store_id', storeId.toString());
	params.set('name_query', nameQuery);

	try {
		const userCookies = await cookies();

		const requestInit: RequestInit = {
			credentials: 'include',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
		};

		const response = await fetch(url.href, requestInit);
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

		interface GetAllV2Response {
			store_stocks: StoreStockV2Def[];
			count: number;
		}
		const storeResponse: HTTPSuccessResponse<GetAllV2Response> = await response.json();
		const storeStockDefs = storeResponse.data.store_stocks;
		const count = storeResponse.data.count;

		return { result: { storeStockDefs, count }, error: null };
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}

		console.error(error);
		return { result: null, error: 'Unknown error' };
	}
}

export async function transferStockToWarehouse(val: TransferStockRequest): Promise<HTTPResult<void>> {
	if (convertTo.number(val.itemId) === null) return { result: null, error: 'Check input for item ID' };
	if (convertTo.number(val.quantity) === null) return { result: null, error: 'Check input for quantity' };
	if (convertTo.number(val.storeId) === null) return { result: null, error: 'Check input for store ID' };
	if (convertTo.number(val.tenantId) === null) return { result: null, error: 'Check input for tenant ID' };

	try {
		const userCookies = await cookies();

		const reqBody = {
			quantity: val.quantity,
			item_id: val.itemId,
			store_id: val.storeId,
		};

		const requestInit: RequestInit = {
			method: 'PUT',
			credentials: 'include',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
		};

		const targetURL = serverRoutes.transferStockToWarehouse.replace('<tenantId>', val.tenantId.toString());
		const response = await fetch(targetURL, requestInit);
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
					console.error(`[UNHANDLED ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		// 202 Accepted
		return { result: null, error: null };
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}

		console.error(error);
		return { result: null, error: '[UNHANDLED ERROR] Unknown error' };
	}
}

export async function transferStockToStoreStock(val: TransferStockRequest): Promise<HTTPResult<void>> {
	if (convertTo.number(val.itemId) === null) return { result: null, error: 'Check input for item ID' };
	if (convertTo.number(val.quantity) === null) return { result: null, error: 'Check input for quantity' };
	if (convertTo.number(val.storeId) === null) return { result: null, error: 'Check input for store ID' };
	if (convertTo.number(val.tenantId) === null) return { result: null, error: 'Check input for store ID' };
	if (val.quantity < 1) {
		return { result: null, error: 'Invalid quantity. Allowed quantity is > 0' };
	}

	try {
		const userCookies = await cookies();

		const reqBody = {
			quantity: val.quantity,
			item_id: val.itemId,
			store_id: val.storeId,
		};

		const requestInit: RequestInit = {
			method: 'PUT',
			credentials: 'include',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
		};

		const targetURL = serverRoutes.transferStockToStoreStock.replace('<tenantId>', val.tenantId.toString());
		const response = await fetch(targetURL, requestInit);
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
					console.error(`[UNHANDLED ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		// 202 Accepted
		return { result: null, error: null };
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}

		console.error(error);
		return { result: null, error: '[UNHANDLED ERROR] Unknown error' };
	}
}

export async function editStoreStockInformation(storeStockDef: StoreStockDef): Promise<HTTPResult<void>> {
	try {
		const userCookies = await cookies();

		const reqBody = storeStockDef; // Already match with backend required body properties

		const requestInit: RequestInit = {
			method: 'PUT',
			credentials: 'include',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
		};

		const targetURL = serverRoutes.editStoreStockInformation.replace('<tenantId>', storeStockDef.tenant_id.toString());
		const response = await fetch(targetURL, requestInit);
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
					console.error(`[UNHANDLED ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		// 202 Accepted
		return { result: null, error: null };
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}

		console.error(error);
		return { result: null, error: '[UNHANDLED ERROR] Unknown error' };
	}
}
