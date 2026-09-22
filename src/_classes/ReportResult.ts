import { PaymentStatus } from '@/_interface/PaymentStatus';
import { PaymentType } from '@/_interface/PaymentType';
import {
	DailyTrendDef,
	ReportResultDef,
	TopItemByProfitDef,
	TopItemByQuantityDef,
	TopItemByRevenueDef,
} from '@/_interface/ReportResultDef';

export class ReportResult {
	sumDiscountAmount: number;
	sumPurchasedPrice: number;
	sumSubtotal: number;
	sumTotalAmount: number;
	sumTotalQuantity: number;
	sumTransactions: number;
	sumProfit: number;
	avgOrderValue: number;
	avgItemsPerOrder: number;
	stockSyncPending: number;
	sumSubtotalSuccess: number;
	sumRevenueSuccess: number;
	sumBasePriceSuccess: number;
	sumPurchasedPriceSuccess: number;
	paymentStatusCount: Partial<Record<PaymentStatus, number>>;
	paymentStatusAmount: Partial<Record<PaymentStatus, number>>;
	paymentTypeCount: Partial<Record<PaymentType, number>>;
	paymentTypeAmount: Partial<Record<PaymentType, number>>;
	topItemsByQuantity: TopItemByQuantityDef[];
	topItemsByRevenue: TopItemByRevenueDef[];
	topItemsByProfit: TopItemByProfitDef[];
	dailyTrend: DailyTrendDef[];

	constructor(def: ReportResultDef) {
		this.sumDiscountAmount = def.sum_discount_amount;
		this.sumPurchasedPrice = def.sum_purchased_price;
		this.sumSubtotal = def.sum_subtotal;
		this.sumTotalAmount = def.sum_total_amount;
		this.sumTotalQuantity = def.sum_total_quantity;
		this.sumTransactions = def.sum_transactions;
		this.sumProfit = def.sum_profit;
		this.avgOrderValue = def.avg_order_value;
		this.avgItemsPerOrder = def.avg_items_per_order;
		this.stockSyncPending = def.stock_sync_pending;
		this.sumSubtotalSuccess = def.sum_subtotal_success;
		this.sumRevenueSuccess = def.sum_revenue_success;
		this.sumBasePriceSuccess = def.sum_base_price_success;
		this.sumPurchasedPriceSuccess = def.sum_purchased_price_success;
		this.paymentStatusCount = def.payment_status_count;
		this.paymentStatusAmount = def.payment_status_amount;
		this.paymentTypeCount = def.payment_type_count;
		this.paymentTypeAmount = def.payment_type_amount;
		this.topItemsByQuantity = def.top_items_by_quantity;
		this.topItemsByRevenue = def.top_items_by_revenue;
		this.topItemsByProfit = def.top_items_by_profit;
		this.dailyTrend = def.daily_trend;
	}

	getChanges() {
		return this.sumPurchasedPrice - this.sumTotalAmount;
	}

	getChangesSuccess() {
		return this.sumPurchasedPriceSuccess - this.sumRevenueSuccess;
	}
}
