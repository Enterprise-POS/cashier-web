import { StockType } from '@/_interface/ItemDef';

export interface StoreStockDef {
	id: number;
	item_id: number;
	tenant_id: number;
	stocks: number;
	store_id: number;
	price: number;
	// created_at: string;
	updated_at: string;
}

// This interface is from store_stock join warehouse
// So it's not pure store_stock table definition
export interface StoreStockV2Def extends StoreStockDef {
	item_name: string;
	created_at: string; // Warehouse item created_at;
	stock_type: StockType;
	category_name: string;
	category_id: number;

	base_price: number;
	// total_count: number; Will not use this property, instead use count that will return with StoreStockV2,
	// see route GetAllV2
}
