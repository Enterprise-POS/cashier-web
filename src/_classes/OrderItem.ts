import { OrderItemDef } from '@/_interface/OrderItemDef';

export class OrderItem {
	id: number;
	purchasedPrice: number;
	totalQuantity: number;
	totalAmount: number;
	discountAmount: number;
	subTotal: number;
	storeId: number;
	tenantId: number;
	createdAt: Date;
	constructor(def: OrderItemDef) {
		this.id = def.id;
		this.purchasedPrice = def.purchased_price;
		this.totalQuantity = def.total_quantity;
		this.totalAmount = def.total_amount;
		this.discountAmount = def.discount_amount;
		this.subTotal = def.subtotal;
		this.storeId = def.store_id;
		this.tenantId = def.tenant_id;

		this.createdAt = def.created_at !== undefined ? new Date(def.created_at) : new Date(); // ex: '2025-09-18T04:06:50.812337Z';
	}
}
