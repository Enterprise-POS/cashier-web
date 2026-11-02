export type VoucherType =
	| 'FROM_TOTAL_LIMITED_PERCENTAGE'
	| 'FROM_TOTAL_LIMITED_STATIC_DECREMENT'
	| 'ITEM_COMBINATIONS'
	| 'ITEM_QUANTITIES';

export type CreatableVoucherType =
	| 'FROM_TOTAL_LIMITED_PERCENTAGE'
	| 'FROM_TOTAL_LIMITED_STATIC_DECREMENT'
	| 'ITEM_COMBINATIONS';

export enum VoucherRoundingPolicy {
	CEIL = 'CEIL',
	ROUND = 'ROUND',
	FLOOR = 'FLOOR',
}

export interface VoucherDef {
	id: number;
	tenant_id: number;
	code: string;
	name: string;
	voucher_type: VoucherType;
	created_at?: string | number;
	used_count: number;
	usage_limit: number;
	start_at?: string | number | null;
	end_at?: string | number | null;
	percentage?: number;
	maximum_decrement?: number;
	rounding_policy?: VoucherRoundingPolicy | '';
	decrement?: number;
	item_id_combinations?: number[] | null;
	item_quantities?: number;
}

export interface VoucherListResponse {
	vouchers: VoucherDef[];
	count: number;
}

export interface CreateVoucherRequest {
	code: string;
	name: string;
	tenant_id: number;
	voucher_type: CreatableVoucherType;
	percentage?: number;
	maximum_decrement?: number;
	rounding_policy?: VoucherRoundingPolicy;
	decrement?: number;
	item_id_combinations?: number[];
	start_at?: number;
	end_at?: number;
}

export interface EditVoucherRequest {
	name: string;
	code: string;
	start_at: number | null;
	end_at: number | null;
}
