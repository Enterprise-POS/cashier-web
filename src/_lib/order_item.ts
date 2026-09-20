'use server';

import { cookies } from 'next/headers';

import { DateFilter } from '@/_interface/DateFilter';
import { ErrorResponse } from '@/_interface/ErrorResponse';
import { HTTPResult } from '@/_interface/HTTPResult';
import { HTTPSuccessResponse } from '@/_interface/HTTPSuccessResponse';
import { OrderItemDef } from '@/_interface/OrderItemDef';
import { PurchasedItemDef } from '@/_interface/PurchasedItemDef';
import { serverRoutes } from '@/components/core/data/serverRoutes';

export async function orderItemExportProfit(
	tenantId: number,
	storeId: number | null,
	dateFilter: DateFilter | null,
): Promise<HTTPResult<string>> {
	try {
		const userCookies = await cookies();

		const reqBody = {
			store_id: storeId,
			date_filter: dateFilter,
		};

		const requestInit: RequestInit = {
			method: 'POST',
			credentials: 'include',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
		};

		const targetURL = serverRoutes.orderItemExportProfit.replace('<tenantId>', tenantId.toString());
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

		const buffer = await response.arrayBuffer();
		const base64 = Buffer.from(buffer).toString('base64');
		return { result: base64, error: null };
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}

		console.error(error);
		return { result: null, error: '[UNHANDLED ERROR] Unknown error' };
	}
}

export type OrderItemFindByIdReturnType = {
	order_item: OrderItemDef;
	purchased_item_list: PurchasedItemDef[];
	requested_order_item_id: number;
};
export async function orderItemFindById(
	id: number,
	tenantId: number,
): Promise<HTTPResult<OrderItemFindByIdReturnType>> {
	const params = new URLSearchParams({
		order_item_id: id.toString(),
	});
	const paramsString = `?${params.toString()}`;

	try {
		const userCookies = await cookies();

		const requestInit: RequestInit = {
			credentials: 'include',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
		};

		const targetURL = `${serverRoutes.orderItemFindById.replace('<tenantId>', tenantId.toString())}${paramsString}`;
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

		// 200 Ok
		const successResponse: HTTPSuccessResponse<OrderItemFindByIdReturnType> = await response.json();
		const result: OrderItemFindByIdReturnType = successResponse.data;

		return { result, error: null };
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}

		console.error(error);
		return { result: null, error: '[UNHANDLED ERROR] Unknown error' };
	}
}

export async function orderItemDeleteInvoice(orderItemId: number, tenantId: number): Promise<HTTPResult<void>> {
	try {
		const userCookies = await cookies();

		const reqBody = {
			order_item_id: orderItemId,
		};

		const requestInit: RequestInit = {
			method: 'DELETE',
			credentials: 'include',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
		};

		const targetURL = `${serverRoutes.orderItemDeleteInvoice.replace('<tenantId>', tenantId.toString())}`;
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

		// 200 Ok
		// const successResponse: HTTPSuccessResponse<void> = await response.json();

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
