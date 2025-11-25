import { StoreStockDef, StoreStockV2Def } from '@/_interface/StoreStockDef';

export class StoreStock {
	id: number;
	stocks: number;
	price: number;
	itemId: number;
	tenantId: number;
	storeId: number;
	createdAt: Date;
	constructor(def: StoreStockDef) {
		this.id = def.id;
		this.stocks = def.stocks;
		this.price = def.price;
		this.itemId = def.item_id;
		this.tenantId = def.tenant_id;
		this.storeId = def.store_id;
		this.createdAt = def.created_at !== undefined ? new Date(def.created_at) : new Date(); // ex: '2025-09-18T04:06:50.812337Z';
	}
}

export class StoreStockV2 {
	id: number;
	itemId: number;
	itemName: string;
	price: number;
	stocks: number;
	createdAt: Date; // Warehouse item created_at;
	private def: StoreStockV2Def;
	constructor(def: StoreStockV2Def) {
		this.def = def;
		this.id = def.id;
		this.itemId = def.item_id;
		this.itemName = def.item_name;
		this.price = def.price;
		this.stocks = def.stocks;
		this.createdAt = def.created_at !== undefined ? new Date(def.created_at) : new Date(); // ex: '2025-09-18T04:06:50.812337Z';
	}

	getDef(): StoreStockV2Def {
		return this.def;
	}
}
