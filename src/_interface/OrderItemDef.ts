export interface OrderItemDef {
	id: number;
	purchased_price: number;
	created_at: string;
	total_quantity: number;
	total_amount: number;
	discount_amount: number;
	subtotal: number;
	store_id: number;
	tenant_id: number;
}
