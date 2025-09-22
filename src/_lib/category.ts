'use server';

import { CategoryDef } from '@/_interface/CategoryDef';
import { ErrorResponse } from '@/_interface/ErrorResponse';
import { HTTPResult } from '@/_interface/HTTPResult';
import { HTTPSuccessResponse } from '@/_interface/HTTPSuccessResponse';
import { signOut } from '@/_lib/action';
import { getAuth } from '@/_lib/auth';
import { convertTo } from '@/_lib/utils';
import { StatusCode } from '@/components/core/data/constant';
import { serverRoutes } from '@/components/core/data/serverRoutes';
import { cookies } from 'next/headers';

export async function getCategories(
	tenantId: number,
	page: number,
	limit: number
): Promise<HTTPResult<{ categoryDefs: CategoryDef[]; count: number }>> {
	const params = new URLSearchParams({
		tenantId: tenantId.toString(),
		limit: limit.toString(),
		page: page.toString(),
	});

	const paramsString = `?${params.toString()}`;
	const userCookies = await cookies();
	const requestInit: RequestInit = {
		credentials: 'include',
		headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
	};

	const response = await fetch(
		serverRoutes.getCategories.replace('<tenantId>', tenantId.toString()) + paramsString,
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

	const categoryResponse: HTTPSuccessResponse<{ categories: CategoryDef[]; count: number }> = await response.json();
	const categoryDefs = categoryResponse.data.categories;
	const count = categoryResponse.data.count;

	return { result: { categoryDefs, count }, error: null };
}

export async function addCategory(formData: FormData): Promise<HTTPResult<CategoryDef>> {
	const categoryName: FormDataEntryValue | null = formData.get('categoryName');
	const tenantId: FormDataEntryValue | null = formData.get('tenantId');
	if (convertTo.number(tenantId) === null) {
		return { result: null, error: 'Something wrong while submitting. Form malfunction' };
	}

	if (typeof categoryName !== 'string' || categoryName.trim() === '') {
		return { result: null, error: 'Please check category name' };
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

	const reqBody = {
		categories: [categoryName], // By default back-end api support multiple create category
	};

	const userCookies = await cookies();
	const requestInit: RequestInit = {
		method: 'POST',
		credentials: 'include',
		headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
		body: JSON.stringify(reqBody),
	};
	const response = await fetch(serverRoutes.addCategory.replace('<tenantId>', tenantId!.toString()), requestInit);

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

		switch (response.status) {
			case StatusCode.UNAUTHORIZED:
				return { result: null, error: body.message };
			case StatusCode.FORBIDDEN:
				return { result: null, error: body.message };
			case StatusCode.BAD_REQUEST:
				return { result: null, error: body.message };
			default:
				console.error(`[SERVER ERROR] ${response.status}: ${body.message}`);
				return { result: null, error: body.message };
		}
	}

	const body: HTTPSuccessResponse<{ categories: CategoryDef[] }> = await response.json();

	// Because this action only create 1 category, so get the first index
	const category = body.data.categories.at(0);
	if (category === undefined)
		return { result: null, error: 'Unexpected error, Response success but nothing is return' };

	return { result: category, error: null };
}

export async function editCategory(formData: FormData): Promise<HTTPResult<CategoryDef>> {
	const inpCategoryId: FormDataEntryValue | null = formData.get('categoryId');
	const categoryName: FormDataEntryValue | null = formData.get('categoryName');
	const inpTenantId: FormDataEntryValue | null = formData.get('tenantId');
	const tenantId = convertTo.number(inpTenantId);
	if (tenantId === null) {
		return { result: null, error: 'Something wrong while submitting. Form malfunction' };
	}

	const categoryId = convertTo.number(inpCategoryId);
	if (categoryId === null) {
		return { result: null, error: 'Something wrong while submitting. Form malfunction' };
	}

	if (typeof categoryName !== 'string' || categoryName.trim() === '') {
		return { result: null, error: 'Please check category name' };
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

	const reqBody = {
		category_id: categoryId,
		category_name: categoryName,
	};

	const userCookies = await cookies();
	const requestInit: RequestInit = {
		method: 'PUT',
		credentials: 'include',
		headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
		body: JSON.stringify(reqBody),
	};

	const response = await fetch(serverRoutes.updateCategory.replace('<tenantId>', tenantId!.toString()), requestInit);
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

		switch (response.status) {
			case StatusCode.UNAUTHORIZED:
			case StatusCode.FORBIDDEN:
			case StatusCode.BAD_REQUEST:
				return { result: null, error: body.message };
			default:
				console.error(`[SERVER ERROR] ${response.status}: ${body.message}`);
				return { result: null, error: body.message };
		}
	}

	// 200 OK
	const body: HTTPSuccessResponse<{ updated_category: CategoryDef }> = await response.json();
	const categoryDef = body.data.updated_category;

	return { result: categoryDef, error: null };
}

export async function deleteCategory(tenantId: number, categoryId: number): Promise<HTTPResult<void>> {
	// Deleting category also delete the connection with
	// the item that associate with current Category

	const auth = await getAuth();
	if (auth === null) {
		// If this fail, means user should log in
		const isSuccess = await signOut();
		// Success signin out the user, we don't need send/return feedback
		if (isSuccess.result) return { result: null, error: null };
		// Unexpected error while signing out user
		else return { result: null, error: 'Unexpected error while submitting the form.' };
	}

	// ? Maybe could use interface to maintain if the code break in the future
	const reqBody = {
		category_id: categoryId,
	};

	const userCookies = await cookies();
	const requestInit: RequestInit = {
		method: 'DELETE',
		credentials: 'include',
		headers: { Cookie: userCookies.toString(), 'Content-Type': 'application/json' },
		body: JSON.stringify(reqBody),
	};

	const response = await fetch(serverRoutes.deleteCategory.replace('<tenantId>', tenantId!.toString()), requestInit);
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

		switch (response.status) {
			case StatusCode.UNAUTHORIZED:
			case StatusCode.FORBIDDEN:
			case StatusCode.BAD_REQUEST:
				return { result: null, error: body.message };
			default:
				console.error(`[SERVER ERROR] ${response.status}: ${body.message}`);
				return { result: null, error: body.message };
		}
	}

	// 204 NO CONTENT
	return { result: null, error: null };
}
