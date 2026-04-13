import { QueryFilter, SortState } from '@/_interface/QueryFilter';

export const convertTo = {
	number: (v: unknown) => {
		const value = Number(v);
		return isNaN(value) ? null : value;
	},
};

export function closeBootstrapModal(selector: string) {
	// Because bootstrap modal not maintained by react, programmatic close modal
	const closeButton = document.querySelector(selector);
	if (closeButton !== null) (closeButton as HTMLElement).click();
	else console.warn(`Nothing to close from ${selector}`);
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
