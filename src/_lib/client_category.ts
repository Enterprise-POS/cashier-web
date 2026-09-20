import { CategoryWithItemDef } from '@/_interface/CategoryDef';
import { ErrorResponse } from '@/_interface/ErrorResponse';
import { HTTPResult } from '@/_interface/HTTPResult';
import { HTTPSuccessResponse } from '@/_interface/HTTPSuccessResponse';
import { server_routes } from '@/components/core/data/server_routes';

export async function getCategoryWithItems(
	page: number | null,
	limit: number | null,
	nameQuery: string,
	tenantId: number,
	token: string,
): Promise<HTTPResult<{ items: CategoryWithItemDef[]; count: number }>> {
	try {
		const reqBody = {
			page: page,
			limit: limit,
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
