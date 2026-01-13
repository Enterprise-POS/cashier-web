'use server';

import { cookies } from 'next/headers';

import { DateFilter } from '@/_interface/DateFilter';
import { ErrorResponse } from '@/_interface/ErrorResponse';
import { HTTPResult } from '@/_interface/HTTPResult';
import { HTTPSuccessResponse } from '@/_interface/HTTPSuccessResponse';
import { ReportResultDef } from '@/_interface/ReportResultDef';
import { serverRoutes } from '@/components/core/data/serverRoutes';
import { OrderItemDef } from '@/_interface/OrderItemDef.js';

export async function orderItemSalesReport(
	tenantId: number,
	storeId: number | null,
	dateFilter: DateFilter | null
): Promise<HTTPResult<ReportResultDef>> {
	try {
		const userCookies = await cookies();

		const reqBody = {
			// tenant_id: tenantId, // Provided with url params
			store_id: storeId,
			date_filter: dateFilter, // dateFilter: Already json structure
		};

		const requestInit: RequestInit = {
			method: 'POST',
			credentials: 'include',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
		};

		const targetURL = serverRoutes.orderItemSalesReport.replace('<tenantId>', tenantId.toString());
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
		const successResponse: HTTPSuccessResponse<ReportResultDef> = await response.json();
		const report = successResponse.data;

		return { result: report, error: null };
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}

		console.error(error);
		return { result: null, error: '[UNHANDLED ERROR] Unknown error' };
	}
}

export async function orderItemGetSearch(
	tenantId: number,
	storeId: number,
	limit: number,
	page: number,
	dateFilter: DateFilter
): Promise<HTTPResult<OrderItemDef[]>> {
	try {
		const userCookies = await cookies();

		const reqBody = {
			tenant_id: tenantId,
			store_id: storeId,
			limit: limit,
			page: page,
			filters: [],
			date_filter: dateFilter,
		};

		const requestInit: RequestInit = {
			method: 'POST',
			credentials: 'include',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
		};

		const targetURL = serverRoutes.orderItemGetSearch.replace('<tenantId>', tenantId.toString());
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
		const successResponse: HTTPSuccessResponse<{ order_items: OrderItemDef[] }> = await response.json();
		const orderItemDefs = successResponse.data.order_items;

		return { result: orderItemDefs, error: null };
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return { result: null, error: error.message };
		}

		console.error(error);
		return { result: null, error: '[UNHANDLED ERROR] Unknown error' };
	}
}
