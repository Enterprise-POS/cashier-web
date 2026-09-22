import { PaymentStatus } from '@/_interface/PaymentStatus';
import { PaymentType } from '@/_interface/PaymentType';

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
	payment_status: PaymentStatus;
	payment_type: PaymentType;
	payment_token: string;
	payment_url: string;
	transaction_id: string;
	is_data_stock_sync: boolean;
}
