import { ErrorResponse } from '@/_interface/ErrorResponse';
import { QueryFilter, SortState } from '@/_interface/QueryFilter';
import { getUserFacingHttpError } from '@/_lib/httpError';

export const convertTo = {
	number: (v: unknown) => {
		const value = Number(v);
		return isNaN(value) ? 0 : value;
	},
};

export function toDate(value?: string | number | null): Date | null {
	if (value == null || value === '') return null;
	const normalized = typeof value === 'number' && value < 1_000_000_000_000 ? value * 1000 : value;
	const date = new Date(normalized);
	return Number.isNaN(date.getTime()) ? null : date;
}

export function authorizedRequest(token: string, method: RequestInit['method'], body?: unknown): RequestInit {
	return {
		method,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		...(body === undefined ? {} : { body: JSON.stringify(body) }),
	};
}

export async function ensureSuccess(response: Response): Promise<void> {
	if (response.ok) return;

	let message: unknown;
	try {
		const body = (await response.json()) as Partial<ErrorResponse>;
		message = body.message;
	} catch {
		message = response.statusText;
	}
	throw new Error(getUserFacingHttpError(response.status, message));
}

export function closeBootstrapModal(selector: string) {
	// Because bootstrap modal not maintained by react, programmatic close modal
	const closeButton = document.querySelector(selector);
	if (closeButton !== null) (closeButton as HTMLElement).click();
	else console.warn(`Nothing to close from ${selector}`);
}

export function hideBootstrapModal(selector: string) {
	const modalElement = document.querySelector(selector);
	if (modalElement) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).bootstrap.Modal.getInstance(modalElement)?.hide();
	} else {
		console.warn(`Modal element not found: ${selector}`);
	}
}

export function openBootstrapModal(selector: string) {
	const modalElement = document.querySelector(selector);

	if (modalElement) {
		try {
			// Bootstrap 5 way
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const modal = new (window as any).bootstrap.Modal(modalElement);
			modal.show();
		} catch (error) {
			console.error(`Not a bootstrap element ${error}`);
		}
	} else {
		console.warn(`Nothing to close from ${selector}`);
	}
}

export function setStringPrefix(val: string | number, prefix: string): string {
	return val.toString().padStart(val.toString().length + 1, prefix);
}

const idrFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });

export function formatIDR(value: number): string {
	return idrFormatter.format(value);
}

export function convertQueryFilters(queryFilters: QueryFilter[]): string {
	if (!queryFilters || queryFilters.length === 0) return '';

	// Example return: created_at:desc,price:asc
	return queryFilters.map(q => `${q.column}:${q.ascending ? 'asc' : 'desc'}`).join(',');
}

export function buildQueryFilters(sorts: SortState[]): QueryFilter[] {
	return sorts.map(sort => ({ column: sort.column, ascending: sort.ascending }));
}

export const seconds = (n: number) => n * 1000;
export const minutes = (n: number) => n * 60 * 1000;
export const hours = (n: number) => n * 60 * 60 * 1000;
export const days = (n: number) => n * 24 * 60 * 60 * 1000;
