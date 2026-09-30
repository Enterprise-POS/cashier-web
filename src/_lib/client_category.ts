import { CategoryWithItemDef } from '@/_interface/CategoryDef';
import { ErrorResponse } from '@/_interface/ErrorResponse';
import { HTTPResult } from '@/_interface/HTTPResult';
import { HTTPSuccessResponse } from '@/_interface/HTTPSuccessResponse';
import { RegisterCategory } from '@/_interface/RequestBody';
import { getUserFacingHttpError } from '@/_lib/httpError';
import { server_routes } from '@/components/core/data/server_routes';
import type { ProductListSort } from '@/components/store/productListStore';

export async function getCategoryWithItems(
	page: number | null,
	limit: number | null,
	nameQuery: string,
	tenantId: number,
	token: string,
	categoryId: number = 0,
	sorts: ProductListSort[] = [],
): Promise<HTTPResult<{ items: CategoryWithItemDef[]; count: number }>> {
	try {
		const reqBody: {
			page: number | null;
			limit: number | null;
			name_query: string;
			category_id: number;
			filters: ProductListSort[];
		} = {
			page,
			limit,
			name_query: nameQuery,
			category_id: categoryId,
			filters: sorts,
		};

		const requestInit: RequestInit = {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify(reqBody),
		};

		const targetURL = server_routes.getCategoriesWithItems.replace('<tenantId>', tenantId.toString());
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

			return { result: null, error: getUserFacingHttpError(response.status, body.message) };
		}

		// 200 Ok
		const successResponse: HTTPSuccessResponse<{ items: CategoryWithItemDef[]; count: number }> = await response.json();
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

// Different from registerCategory from _lib/category.ts
// This function only support the register and will not handle delete, update
export async function registerCategory(
	tenantId: number,
	token: string,
	itemsWithCategory: RegisterCategory,
): Promise<HTTPResult<void>> {
	const requestInit: RequestInit = {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(itemsWithCategory),
	};

	try {
		const response = await fetch(
			server_routes.registerCategory.replace('<tenantId>', tenantId.toString()),
			requestInit,
		);

		if (!response.ok) {
			let body: ErrorResponse;
			try {
				body = await response.json();
			} catch {
				body = {
					code: response.status,
					status: 'error',
					message: response.statusText.trim(),
				};
			}

			return { result: null, error: getUserFacingHttpError(response.status, body.message) };
		}

		// OK 202 - Request accepted
		return { result: null, error: null };
	} catch (e) {
		const error = e as Error;
		console.error(`Unexpected error from category.registerCategory. error: ${error.message}`);
		return { result: null, error: error.message };
	}
}
