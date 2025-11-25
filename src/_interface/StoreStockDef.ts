import { number } from 'prop-types';

export interface StoreStockDef {
	id: number;
	stocks: number;
	price: number;
	created_at: string;
	item_id: number;
	tenant_id: number;
	store_id: number;
}

// This interface is from store_stock join warehouse
// So it's not pure store_stock table definition
export interface StoreStockV2Def {
	id: number;
	item_name: string;
	stocks: number;
	price: number;
	item_id: number;
	created_at: string; // Warehouse item created_at;

	// total_count: number; Will not use this property, instead use count that will return with StoreStockV2,
	// see route GetAllV2
}
