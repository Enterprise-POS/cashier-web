import { ItemDef } from '@/_interface/ItemDef';

export class Item {
	itemId: number;
	itemName: string;
	stocks: number;
	isActive: number;
	createdAt: string;
	unit: string;
	id: number;
	constructor(def: ItemDef) {
		// Although this is the same properties
		// <Table> need .id otherwise the component throw 'unique key' error
		this.id = def.item_id;
		this.itemId = def.item_id;

		this.itemName = def.item_name;
		this.stocks = def.stocks;
		this.isActive = def.is_active;
		this.createdAt = def.created_at;
		this.unit = 'Pc';
	}
}
