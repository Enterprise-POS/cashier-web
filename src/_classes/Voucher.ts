import { VoucherDef, VoucherRoundingPolicy } from '@/_interface/VoucherDef';
import { toDate } from '@/_lib/utils';

export class Voucher {
	id: number;
	code: string;
	name: string;
	tenantId: number;
	createdAt: Date | null;
	voucherType: VoucherDef['voucher_type'];
	usedCount: number;
	usageLimit: number;
	startAt: Date | null;
	endAt: Date | null;
	percentage: number;
	maximumDecrement: number;
	roundingPolicy: VoucherRoundingPolicy;
	decrement: number;
	itemIdCombinations: number[];
	itemQuantities: number;

	constructor(def: VoucherDef) {
		this.id = def.id;
		this.code = def.code;
		this.name = def.name;
		this.tenantId = def.tenant_id;
		this.createdAt = toDate(def.created_at);
		this.voucherType = def.voucher_type;
		this.usedCount = def.used_count ?? 0;
		this.usageLimit = def.usage_limit ?? 0;
		this.startAt = toDate(def.start_at);
		this.endAt = toDate(def.end_at);
		this.percentage = def.percentage ?? 0;
		this.maximumDecrement = def.maximum_decrement ?? 0;
		this.roundingPolicy = def.rounding_policy ?? VoucherRoundingPolicy.ROUND;
		this.decrement = def.decrement ?? 0;
		this.itemIdCombinations = def.item_id_combinations ?? [];
		this.itemQuantities = def.item_quantities ?? 0;
	}
}
