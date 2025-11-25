export interface StoreSetActivateRequestBody {
	// Required field, tenant id will be handled by url tenant id
	store_id: number;

	// What user could edit fields
	set_into: boolean;
}
