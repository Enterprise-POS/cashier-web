import {
	ExpenseCategoryDef,
	ExpenseDef,
	ExpenseInput,
	ExpenseSearchInput,
	ExpenseSearchResult,
} from '@/_interface/ExpenseDef';
import { ErrorResponse } from '@/_interface/ErrorResponse';
import { HTTPResult } from '@/_interface/HTTPResult';
import { HTTPSuccessResponse } from '@/_interface/HTTPSuccessResponse';
import { getUserFacingHttpError } from '@/_lib/httpError';
import { server_routes } from '@/components/core/data/server_routes';

// One place for the fetch + error handling every expense call shares
async function request<T>(
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	route: string,
	tenantId: number,
	token: string,
	body?: unknown,
): Promise<HTTPResult<T>> {
	try {
		const response = await fetch(route.replace('<tenantId>', tenantId.toString()), {
			method,
			credentials: 'include',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: body === undefined ? undefined : JSON.stringify(body),
		});

		if (!response.ok) {
			let errorBody: ErrorResponse;
			try {
				errorBody = await response.json();
			} catch {
				errorBody = { code: response.status, status: 'error', message: response.statusText };
			}
			return { result: null, error: getUserFacingHttpError(response.status, errorBody.message) };
		}

		// 204 No Content (delete)
		if (response.status === 204) return { result: null, error: null };

		const success: HTTPSuccessResponse<T> = await response.json();
		return { result: success.data, error: null };
	} catch (e) {
		const error = e as Error;
		console.error(`Unexpected error from client_expense ${method} ${route}. error: ${error.message}`);
		return { result: null, error: error.message };
	}
}

export function searchExpenses(tenantId: number, token: string, input: ExpenseSearchInput) {
	return request<ExpenseSearchResult>('POST', server_routes.searchExpenses, tenantId, token, input);
}

export async function createExpense(tenantId: number, token: string, input: ExpenseInput) {
	const { result, error } = await request<{ created_expense: ExpenseDef }>(
		'POST',
		server_routes.expenses,
		tenantId,
		token,
		input,
	);
	return { result: result?.created_expense ?? null, error };
}

export async function editExpense(tenantId: number, token: string, input: ExpenseInput) {
	const { result, error } = await request<{ edited_expense: ExpenseDef }>(
		'PUT',
		server_routes.expenses,
		tenantId,
		token,
		input,
	);
	return { result: result?.edited_expense ?? null, error };
}

export function deleteExpense(tenantId: number, token: string, expenseId: number) {
	return request<void>('DELETE', server_routes.expenses, tenantId, token, { expense_id: expenseId });
}

export async function getExpenseCategories(tenantId: number, token: string) {
	const { result, error } = await request<{ expense_categories: ExpenseCategoryDef[] }>(
		'GET',
		server_routes.expenseCategories,
		tenantId,
		token,
	);
	return { result: result?.expense_categories ?? null, error };
}

export async function createExpenseCategory(tenantId: number, token: string, name: string) {
	const { result, error } = await request<{ created_expense_category: ExpenseCategoryDef }>(
		'POST',
		server_routes.expenseCategories,
		tenantId,
		token,
		{ name },
	);
	return { result: result?.created_expense_category ?? null, error };
}

export async function editExpenseCategory(tenantId: number, token: string, categoryId: number, name: string) {
	const { result, error } = await request<{ edited_expense_category: ExpenseCategoryDef }>(
		'PUT',
		server_routes.expenseCategories,
		tenantId,
		token,
		{ expense_category_id: categoryId, name },
	);
	return { result: result?.edited_expense_category ?? null, error };
}

export function deleteExpenseCategory(tenantId: number, token: string, categoryId: number) {
	return request<void>('DELETE', server_routes.expenseCategories, tenantId, token, {
		expense_category_id: categoryId,
	});
}
