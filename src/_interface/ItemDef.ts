export enum StockType {
	TRACKED = 'TRACKED',
	UNLIMITED = 'UNLIMITED',
}

export interface ItemDef {
	item_id: number;
	item_name: string;
	stocks: number;
	is_active: number;
	stock_type: StockType;
	created_at: string;
}
