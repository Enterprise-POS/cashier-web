'use server';

import { ErrorResponse } from '@/_interface/ErrorResponse';
import { HTTPResult } from '@/_interface/HTTPResult';
import { HTTPSuccessResponse } from '@/_interface/HTTPSuccessResponse';
import { ItemDef } from '@/_interface/ItemDef';
import { signOut } from '@/_lib/action';
import { getAuth } from '@/_lib/auth';
import { convertTo } from '@/_lib/utils';
import { all_routes as routes } from '@/components/core/data/all_routes';
import { serverRoutes } from '@/components/core/data/serverRoutes';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getActiveWarehouseItem(
	tenantId: number,
	limit: number,
	page: number,
	nameQuery: string
): Promise<HTTPResult<{ itemDefs: ItemDef[]; count: number }>> {
	const params = new URLSearchParams({
		tenantId: tenantId.toString(),
		limit: limit.toString(),
		page: page.toString(),
	});

	if (nameQuery !== '') {
		params.set('nameQuery', nameQuery);
	}
	const paramsString = `?${params.toString()}`;
	const userCookies = await cookies();
	const requestInit: RequestInit = {
		credentials: 'include',
		headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
	};
	const response = await fetch(
		serverRoutes.getActiveWarehouseItem.replace('<tenantId>', tenantId.toString()) + paramsString,
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
	const warehouseResponse: HTTPSuccessResponse<{ items: ItemDef[]; count: number }> = await response.json();
	const itemDefs = warehouseResponse.data.items;

	return { result: { count: warehouseResponse.data.count, itemDefs }, error: null };
}

export async function createItem(formData: FormData): Promise<HTTPResult<ItemDef>> {
	const tenantId: FormDataEntryValue | null = formData.get('tenantId');
	const itemName: FormDataEntryValue | null = formData.get('productName');
	const stocks: FormDataEntryValue | null = formData.get('stocks');

	if (convertTo.number(tenantId) === null) {
		return { result: null, error: 'Something wrong while submitting. Form malfunction' };
	}

	if (typeof itemName !== 'string' || itemName.trim() === '') {
		return { result: null, error: 'Please check input product name' };
	}

	// 0 is allowed value
	const convertedQuantity = convertTo.number(stocks);
	if (convertedQuantity === null) {
		return { result: null, error: 'Please Check input for stocks' };
	}

	const auth = await getAuth();
	if (auth === null) {
		// If this fail, means user should log in
		const isSuccess = await signOut();
		// Success signin out the user, we don't need send/return feedback
		if (isSuccess.result) return { result: null, error: null };
		// Unexpected error while signing out user
		else return { result: null, error: 'Unexpected error while submitting the form.' };
	}

	try {
		const reqBody = {
			items: [
				{
					item_name: itemName,
					stocks: convertedQuantity,
				},
			],
		};

		const userCookies = await cookies();
		const requestInit: RequestInit = {
			method: 'POST',
			credentials: 'include',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
		};
		const response = await fetch(
			serverRoutes.createWarehouseItem.replace('<tenantId>', tenantId!.toString()),
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
				case 400:
				case 401:
				case 403:
					return { result: null, error: body.message };
				default:
					console.error(`[SERVER ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		const body: HTTPSuccessResponse<{ items: ItemDef[] }> = await response.json();
		const items = body.data.items;

		// Since this function only create 1 item. The success result will be guaranteed 1
		return { result: items[0], error: null };
	} catch (error: unknown) {
		if (error instanceof Error) {
			return { result: null, error: error.message };
		}

		console.error('Unexpected error: ', error);
		return { result: null, error: 'Unexpected error: ' + error };
	}
}

export async function getItemFindById(itemId: number | null, tenantId: number | null): Promise<HTTPResult<ItemDef>> {
	/*
		If redirect() called, then we don't need to return anything
	*/
	if (itemId === null || tenantId === null) return redirect(routes.productList);

	try {
		const reqBody = { item_id: itemId };

		const userCookies = await cookies();
		const requestInit: RequestInit = {
			method: 'POST',
			credentials: 'include',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
		};
		const response = await fetch(
			serverRoutes.warehouseItemFindById.replace('<tenantId>', tenantId!.toString()),
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
				case 400:
				case 401:
				case 403:
					return { result: null, error: body.message };
				default:
					console.log(body);
					console.error(`[SERVER ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		const body: HTTPSuccessResponse<{ item: ItemDef }> = await response.json();

		return { result: body.data.item, error: null };
	} catch (error: unknown) {
		if (error instanceof Error) {
			return { result: null, error: error.message };
		}

		return { result: null, error: 'Unexpected error, ' + error };
	}
}

export async function editWarehouseItem(formData: FormData): Promise<HTTPResult<boolean>> {
	const tenantId: FormDataEntryValue | null = formData.get('tenantId');
	const itemId: FormDataEntryValue | null = formData.get('itemId');
	const itemName: FormDataEntryValue | null = formData.get('productName');
	const quantity: FormDataEntryValue | null = formData.get('quantity');

	const convertedTenantId = convertTo.number(tenantId);
	if (convertedTenantId === null) {
		return { result: null, error: 'Something wrong while submitting. Form malfunction' };
	}

	const convertedItemId = convertTo.number(itemId);
	if (convertedItemId === null) {
		return { result: null, error: 'Something wrong while submitting. Form malfunction' };
	}

	if (typeof itemName !== 'string' || itemName.trim() === '') {
		return { result: null, error: 'Please check input product name' };
	}

	// 0 is allowed value
	const convertedQuantity = convertTo.number(quantity);
	if (convertedQuantity === null) {
		return { result: null, error: 'Please Check input for stocks' };
	}

	try {
		const reqBody = {
			quantity: convertedQuantity,
			item: {
				item_id: convertedItemId,
				item_name: itemName.toString(),
			},
		};

		const userCookies = await cookies();
		const requestInit: RequestInit = {
			method: 'PUT',
			credentials: 'include',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
		};
		const response = await fetch(
			serverRoutes.editWarehouseItem.replace('<tenantId>', tenantId!.toString()),
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
				case 400:
				case 401:
				case 403:
					return { result: null, error: body.message };
				default:
					console.error(`[SERVER ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		// 202
		revalidatePath(routes.editProduct.replace('<itemId>', itemId!.toString()));
		return { result: true, error: null };
	} catch (error) {
		if (error instanceof Error) {
			return { result: null, error: error.message };
		}

		return { result: null, error: 'Unexpected error, ' + error };
	}
}

export async function setItemActivate(itemId: number, tenantId: number, setInto: boolean): Promise<HTTPResult<void>> {
	const auth = await getAuth();
	if (auth === null) {
		console.error('[ERROR] Fatal error user not logged in, but requesting to delete action');
		return { result: null, error: '[ERROR] Fatal error user not logged in, but requesting to delete action' };
	}

	try {
		type SetActivateBody = {
			item_id: number;
			set_into: boolean;
		};
		const reqBody: SetActivateBody = {
			item_id: itemId,
			set_into: setInto,
		};

		const userCookies = await cookies();

		const requestInit: RequestInit = {
			method: 'PUT',
			headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
		};

		const response = await fetch(
			serverRoutes.warehouseSetActivate.replace('<tenantId>', tenantId.toString()),
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
				case 400:
				case 401:
				case 403:
					return { result: null, error: body.message };
				default:
					console.error(`[SERVER ERROR] ${response.status}: ${body.message}`);
					return { result: null, error: body.message };
			}
		}

		// ok
		return { result: null, error: null };
	} catch (e) {
		const error = e as Error;

		return { result: null, error: `Unexpected error: ${error.message}` };
	}
}
