import { OrderItemDef } from '@/_interface/OrderItemDef';
import { PaymentStatus } from '@/_interface/PaymentStatus';
import { PaymentType } from '@/_interface/PaymentType';

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
	paymentStatus: PaymentStatus;
	paymentType: PaymentType;
	paymentToken: string;
	paymentUrl: string;
	transactionId: string;
	isDataStockSync: boolean;

	constructor(def: OrderItemDef) {
		this.id = def.id;
		this.purchasedPrice = def.purchased_price;
		this.totalQuantity = def.total_quantity;
		this.totalAmount = def.total_amount;
		this.discountAmount = def.discount_amount;
		this.subTotal = def.subtotal;
		this.storeId = def.store_id;
		this.tenantId = def.tenant_id;
		this.paymentStatus = def.payment_status;
		this.paymentType = def.payment_type;
		this.paymentToken = def.payment_token;
		this.paymentUrl = def.payment_url;
		this.transactionId = def.transaction_id;
		this.isDataStockSync = def.is_data_stock_sync;

		this.createdAt = def.created_at !== undefined ? new Date(def.created_at) : new Date(); // ex: '2025-09-18T04:06:50.812337Z';
	}
}
