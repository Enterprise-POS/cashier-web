export interface RegisterCategory {
	tobe_registers: { item_id: number; category_id: number }[];
}

export interface UnregisterCategory {
	category_id: number;
	item_id: number;
}

export type EditItemCategory = UnregisterCategory;
