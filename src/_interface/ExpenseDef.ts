import { DateFilter } from '@/_interface/DateFilter';

// API values for payment_type (same as order_item)
export const ExpensePaymentTypes = ['CASH', 'QRIS', 'CARD', 'EWALLET', 'OTHER'] as const;
export type ExpensePaymentType = (typeof ExpensePaymentTypes)[number];

export interface ExpenseCategoryDef {
	id: number;
	tenant_id: number;
	name: string;
	created_at?: string;
}

export interface ExpenseDef {
	id: number;
	tenant_id: number;
	store_id: number | null; // null = whole business
	expense_category_id: number | null; // null = uncategorized
	expense_category_name: string | null;
	amount: number;
	description: string;
	expense_date: string;
	payment_type: ExpensePaymentType;
	responsible_user_id: number;
	responsible_user_name_snapshot: string;
	created_at?: string;
	updated_at?: string;
}

// PUT replaces every field, always send the whole form
export interface ExpenseInput {
	expense_id?: number;
	store_id: number | null;
	expense_category_id: number | null;
	amount: number;
	description: string;
	expense_date: number; // epoch seconds
	payment_type: ExpensePaymentType;
}

export type ExpenseSortColumn = 'expense_date' | 'amount' | 'created_at';

export interface ExpenseSearchInput {
	store_id: number; // 0 = all, -1 = whole business only
	expense_category_id: number; // 0 = all, -1 = uncategorized
	limit: number;
	page: number;
	filters: { column: ExpenseSortColumn; ascending: boolean }[];
	date_filter: DateFilter | null;
}

export interface ExpenseSearchResult {
	expenses: ExpenseDef[];
	total_count: number;
	sum_amount: number; // every matched row, not only this page
}
