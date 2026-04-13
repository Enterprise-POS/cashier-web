export interface WithdrawProductFromStoreRequestValue {
	itemId: number;
	storeId: number;
	storeStockId: number;
	tenantId: number;
	itemName: string;
}

export interface WithdrawProductFromStoreRequestBody {
	item_id: number;
	store_id: number;
	store_stock_id: number;
}
