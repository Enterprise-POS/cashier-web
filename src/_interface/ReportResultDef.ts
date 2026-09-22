import { PaymentStatus } from '@/_interface/PaymentStatus';
import { PaymentType } from '@/_interface/PaymentType';

export interface TopItemByQuantityDef {
	item_name: string;
	total_quantity: number;
}

export interface TopItemByRevenueDef {
	item_name: string;
	total_revenue: number;
}

export interface TopItemByProfitDef {
	item_name: string;
	total_revenue: number;
	total_base_price: number;
	total_profit: number;
	margin_percent: number;
}

export interface DailyTrendDef {
	date: string;
	total_amount: number;
	transaction_count: number;
	revenue: number;
}

export interface ReportResultDef {
	sum_purchased_price: number;
	sum_subtotal: number;
	sum_total_quantity: number;
	sum_discount_amount: number;
	sum_total_amount: number;
	sum_transactions: number;
	avg_order_value: number;
	avg_items_per_order: number;
	stock_sync_pending: number;
	sum_subtotal_success: number;
	sum_revenue_success: number;
	sum_base_price_success: number;
	sum_purchased_price_success: number;
	sum_profit: number;
	payment_status_count: Partial<Record<PaymentStatus, number>>;
	payment_status_amount: Partial<Record<PaymentStatus, number>>;
	payment_type_count: Partial<Record<PaymentType, number>>;
	payment_type_amount: Partial<Record<PaymentType, number>>;
	top_items_by_quantity: TopItemByQuantityDef[];
	top_items_by_revenue: TopItemByRevenueDef[];
	top_items_by_profit: TopItemByProfitDef[];
	daily_trend: DailyTrendDef[];
}
