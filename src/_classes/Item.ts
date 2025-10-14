import { CategoryWithItemDef } from '@/_interface/CategoryDef';
import { ItemDef } from '@/_interface/ItemDef';

export class Item {
	itemId: number;
	itemName: string;
	stocks: number;
	isActive: number;
	createdAt: Date;
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
		this.createdAt = new Date(def.created_at);
		this.unit = 'Pc';
	}
}

export class CategoryWithItem extends Item {
	categoryName: string;
	categoryId: number;
	constructor(def: CategoryWithItemDef) {
		super({
			item_id: def.item_id,
			item_name: def.item_name,
			stocks: def.stocks,
			created_at: '',
			is_active: 0,
		});
		this.categoryId = def.category_id;
		this.categoryName = def.category_name;
	}
}
