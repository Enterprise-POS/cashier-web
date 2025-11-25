import { StoreStockV2Def } from '@/_interface/StoreStockDef';

export class StoreStockV2 {
	id: number;
	itemId: number;
	itemName: string;
	price: number;
	stocks: number;
	createdAt: Date; // Warehouse item created_at;
	constructor(def: StoreStockV2Def) {
		this.id = def.id;
		this.itemId = def.item_id;
		this.itemName = def.item_name;
		this.price = def.price;
		this.stocks = def.stocks;
		this.createdAt = def.created_at !== undefined ? new Date(def.created_at) : new Date(); // ex: '2025-09-18T04:06:50.812337Z';
	}

	setStocks(quantity: number) {
		// Regardless it's - / +
		this.stocks += quantity;
	}
}
