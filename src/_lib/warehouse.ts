'use server';

import { ErrorResponse } from '@/_interface/ErrorResponse';
import { HTTPResult } from '@/_interface/HTTPResult';
import { ItemDef } from '@/_interface/ItemDef';
import { serverRoutes } from '@/components/core/data/serverRoutes';
import { cookies } from 'next/headers';

export async function getWarehouseItem(
	tenantId: number,
	limit: number,
	page: number
): Promise<HTTPResult<{ itemDefs: ItemDef[]; count: number }>> {
	const paramsString = `?limit=${limit}&page=${page}`;
	const userCookies = await cookies();
	const requestInit: RequestInit = {
		credentials: 'include',
		headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
	};
	const response = await fetch(
		serverRoutes.getWarehouseItem.replace('<tenantId>', tenantId.toString()) + paramsString,
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

	// 200
	type WarehouseResponse = {
		data: { items: ItemDef[]; count: number };
	};
	const warehouseResponse: WarehouseResponse = await response.json();
	const itemDefs = warehouseResponse.data.items;

	return { result: { count: warehouseResponse.data.count, itemDefs }, error: null };
}
