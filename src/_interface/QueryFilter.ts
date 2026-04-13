export const AllowedColumn = {
	createdAt: 'created_at',
	// future:
	// price: 'price',
	// name: 'item_name',
} as const; // no override
export type ColumnName = (typeof AllowedColumn)[keyof typeof AllowedColumn];

export type SortState = {
	column: ColumnName;
	ascending: boolean;
};
export interface QueryFilter {
	column: ColumnName;
	ascending: boolean;
}
