import { ErrorResponse } from '@/_interface/ErrorResponse';
import { HTTPResult } from '@/_interface/HTTPResult';
import { HTTPSuccessResponse } from '@/_interface/HTTPSuccessResponse';
import { StoreStockV2Def } from '@/_interface/StoreStockDef';
import { server_routes } from '@/components/core/data/server_routes';
import { TransferStockRequest } from '@/_interface/TransferStock';
import { convertQueryFilters, convertTo } from '@/_lib/utils';
import { QueryFilter } from '@/_interface/QueryFilter';
import {
	WithdrawProductFromStoreRequestBody,
	WithdrawProductFromStoreRequestValue,
} from '@/_interface/WithdrawProductFromStoreRequestBody.js';

export async function getAllV2(
	storeId: number,
	tenantId: number,
	page: number,
	limit: number,
	nameQuery: string,
	categoryId: number,
	queryFilters: QueryFilter[],
	token: string,
): Promise<HTTPResult<{ count: number; storeStockDefs: StoreStockV2Def[] }>> {
	const targetURL = server_routes.storeStocksGetAllV2.replace('<tenantId>', tenantId.toString());
	const url = new URL(targetURL);
	const params = url.searchParams;
	params.set('page', page.toString());
	params.set('limit', limit.toString());
	params.set('store_id', storeId.toString());
	params.set('name_query', nameQuery);
	params.set('category_id', categoryId.toString());
	const sort = convertQueryFilters(queryFilters);
	if (sort !== '') {
		params.set('sort', sort);
	}

	try {
		const response = await fetch(url.href, {
			credentials: 'include',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
		});

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
					console.error(`[CLIENT ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		interface GetAllV2Response {
			store_stocks: StoreStockV2Def[];
			count: number;
		}
		const storeResponse: HTTPSuccessResponse<GetAllV2Response> = await response.json();

		return {
			result: {
				storeStockDefs: storeResponse.data.store_stocks,
				count: storeResponse.data.count,
			},
			error: null,
		};
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}
		return { result: null, error: 'Unknown error' };
	}
}

export async function transferStockToWarehouse(val: TransferStockRequest, token: string): Promise<HTTPResult<void>> {
	if (convertTo.number(val.itemId) === null) return { result: null, error: 'Check input for item ID' };
	if (convertTo.number(val.quantity) === null) return { result: null, error: 'Check input for quantity' };
	if (convertTo.number(val.storeId) === null) return { result: null, error: 'Check input for store ID' };
	if (convertTo.number(val.tenantId) === null) return { result: null, error: 'Check input for tenant ID' };

	try {
		const reqBody = {
			quantity: val.quantity,
			item_id: val.itemId,
			store_id: val.storeId,
		};

		const targetURL = server_routes.transferStockToWarehouse.replace('<tenantId>', val.tenantId.toString());
		const response = await fetch(targetURL, {
			method: 'PUT',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify(reqBody),
		});

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

		return { result: null, error: null };
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}
		return { result: null, error: '[UNHANDLED ERROR] Unknown error' };
	}
}

export async function transferStockToStoreStock(val: TransferStockRequest, token: string): Promise<HTTPResult<void>> {
	if (convertTo.number(val.itemId) === null) return { result: null, error: 'Check input for item ID' };
	if (convertTo.number(val.quantity) === null) return { result: null, error: 'Check input for quantity' };
	if (convertTo.number(val.storeId) === null) return { result: null, error: 'Check input for store ID' };
	if (convertTo.number(val.tenantId) === null) return { result: null, error: 'Check input for tenant ID' };

	try {
		const reqBody = {
			quantity: val.quantity,
			item_id: val.itemId,
			store_id: val.storeId,
		};

		const targetURL = server_routes.transferStockToStoreStock.replace('<tenantId>', val.tenantId.toString());
		const response = await fetch(targetURL, {
			method: 'PUT',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify(reqBody),
		});

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

		return { result: null, error: null };
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}
		return { result: null, error: '[UNHANDLED ERROR] Unknown error' };
	}
}

export async function editStoreStock(formData: FormData, token: string): Promise<HTTPResult<void>> {
	const id = formData.get('id');
	const price = formData.get('price');
	const storeId = formData.get('storeId');
	const itemId = formData.get('itemId');
	const tenantId = formData.get('tenantId');

	const convertedId = convertTo.number(id);
	const convertedPrice = convertTo.number(price);
	const convertedStoreId = convertTo.number(storeId);
	const convertedItemId = convertTo.number(itemId);
	const convertedTenantId = convertTo.number(tenantId);

	if (!convertedId || !convertedStoreId || !convertedItemId || !convertedTenantId) {
		return { result: null, error: 'Something wrong while submitting. Form malfunction' };
	}

	if (convertedPrice !== null && convertedPrice < 0) {
		return { result: null, error: 'Something wrong. Please check the selling price before submitting' };
	}

	try {
		const reqBody = {
			id: convertedId,
			price: convertedPrice,
			store_id: convertedStoreId,
			item_id: convertedItemId,
		};

		const targetURL = server_routes.editStoreStock.replace('<tenantId>', convertedTenantId.toString());
		const response = await fetch(targetURL, {
			method: 'PUT',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify(reqBody),
		});

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

		return { result: null, error: null };
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}
		return { result: null, error: '[UNHANDLED ERROR] Unknown error' };
	}
}

export async function withdrawStoreStock(
	body: WithdrawProductFromStoreRequestValue,
	token: string,
): Promise<HTTPResult<void>> {
	if (convertTo.number(body.itemId) === null) return { result: null, error: 'Check input for item ID' };
	if (convertTo.number(body.storeId) === null) return { result: null, error: 'Check input for store ID' };
	if (convertTo.number(body.tenantId) === null) return { result: null, error: 'Check input for tenant ID' };

	try {
		const reqBody: WithdrawProductFromStoreRequestBody = {
			item_id: body.itemId,
			store_id: body.storeId,
			store_stock_id: body.storeStockId,
		};

		const targetURL = server_routes.withdrawStoreStock.replace('<tenantId>', body.tenantId.toString());
		const response = await fetch(targetURL, {
			method: 'DELETE',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify(reqBody),
		});

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

		// 204
		return { result: null, error: null };
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}
		return { result: null, error: '[UNHANDLED ERROR] Unknown error' };
	}
}
