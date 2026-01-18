export interface PurchasedItemDef {
	id: number;
	quantity: number;
	purchased_price: number;
	discount_amount: number;
	total_amount: number;
	item_id: number;
	item_name_snapshot: string;
	order_item_id: number;
	created_at: string;
}
