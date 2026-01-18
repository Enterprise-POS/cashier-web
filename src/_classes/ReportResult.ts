import { ReportResultDef } from '@/_interface/ReportResultDef';

export class ReportResult {
	sumDiscountAmount: number;
	sumPurchasedPrice: number;
	sumSubtotal: number;
	sumTotalAmount: number;
	sumTotalQuantity: number;
	sumTransactions: number;
	constructor(def: ReportResultDef) {
		this.sumDiscountAmount = def.sum_discount_amount;
		this.sumPurchasedPrice = def.sum_purchased_price;
		this.sumSubtotal = def.sum_subtotal;
		this.sumTotalAmount = def.sum_total_amount;
		this.sumTotalQuantity = def.sum_total_quantity;
		this.sumTransactions = def.sum_transactions;
	}

	getChanges() {
		return this.sumPurchasedPrice - this.sumTotalAmount;
	}
}
