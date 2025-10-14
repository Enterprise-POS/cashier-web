export interface CategoryDef {
	id?: number;
	category_name: string;
	created_at?: string;
	tenant_id?: number;
}

export interface CategoryWithItemDef {
	category_id: number;
	category_name: string;
	item_id: number;
	item_name: string;
	stocks: number;
}
