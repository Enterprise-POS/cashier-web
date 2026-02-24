import { PurchasedItemDef } from '@/_interface/PurchasedItemDef';

export class PurchasedItem {
	id: number;
	quantity: number;
	discountAmount: number;
	totalAmount: number;
	itemId: number;
	itemNameSnapshot: string;
	orderItemId: number;
	createdAt: Date;
	basePriceSnapshot: number;
	storePriceSnapshot: number;

	constructor(def: PurchasedItemDef) {
		this.id = def.id;
		this.quantity = def.quantity;
		this.totalAmount = def.total_amount;
		this.discountAmount = def.discount_amount;
		this.itemId = def.item_id;
		this.itemNameSnapshot = def.item_name_snapshot;
		this.orderItemId = def.order_item_id;
		this.basePriceSnapshot = def.base_price_snapshot;
		this.storePriceSnapshot = def.store_price_snapshot;

		this.createdAt = def.created_at !== undefined ? new Date(def.created_at) : new Date(); // ex: '2025-09-18T04:06:50.812337Z';
	}
}
