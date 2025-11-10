export const baseURL = process.env.MODE === 'prod' ? process.env.BASE_URL : process.env.DEV_URL;
export const apiVersion = process.env.API_VERSION || 'api/v1';

export const serverRoutes = {
	// user
	signIn: `${baseURL}/${apiVersion}/users/sign_in`,
	signUp: `${baseURL}/${apiVersion}/users/sign_up`,

	// tenant
	getTenantWithUser: `${baseURL}/${apiVersion}/tenants/<userId>`,
	getTenantMembers: `${baseURL}/${apiVersion}/tenants/members/<tenantId>`,
	newTenant: `${baseURL}/${apiVersion}/tenants/new`,
	addUser: `${baseURL}/${apiVersion}/tenants/add_user`,
	removeUserFromTenant: `${baseURL}/${apiVersion}/tenants/remove_user`, // DELETE

	// warehouse
	getWarehouseItem: `${baseURL}/${apiVersion}/warehouses/<tenantId>`, // GET
	getActiveWarehouseItem: `${baseURL}/${apiVersion}/warehouses/active/<tenantId>`, // GET
	createWarehouseItem: `${baseURL}/${apiVersion}/warehouses/create_item/<tenantId>`, // POST
	warehouseItemFindById: `${baseURL}/${apiVersion}/warehouses/find/<tenantId>`, // POST
	warehouseItemFindCompleteById: `${baseURL}/${apiVersion}/warehouses/find_complete_by_id/<tenantId>`, // POST
	editWarehouseItem: `${baseURL}/${apiVersion}/warehouses/edit/<tenantId>`, // PUT
	warehouseSetActivate: `${baseURL}/${apiVersion}/warehouses/activate/<tenantId>`, // PUT

	// category
	getCategories: `${baseURL}/${apiVersion}/categories/<tenantId>`, // GET
	addCategory: `${baseURL}/${apiVersion}/categories/create/<tenantId>`, // POST
	updateCategory: `${baseURL}/${apiVersion}/categories/update/<tenantId>`, // PUT
	deleteCategory: `${baseURL}/${apiVersion}/categories/<tenantId>`, // DELETE
	registerCategory: `${baseURL}/${apiVersion}/categories/register/<tenantId>`, // DELETE
	unregisterCategory: `${baseURL}/${apiVersion}/categories/unregister/<tenantId>`, // DELETE
	editItemCategory: `${baseURL}/${apiVersion}/categories/edit_item_category/<tenantId>`, // PUT

	// store
	getStores: `${baseURL}/${apiVersion}/stores/<tenantId>`, // GET

	// store_stock
	storeStocksGetAllV2: `${baseURL}/${apiVersion}/store_stocks/v2/<tenantId>`, // GET
	transferStockToStoreStock: `${baseURL}/${apiVersion}/store_stocks/transfer_to_store_stock/<tenantId>`, // PUT
	transferStockToWarehouse: `${baseURL}/${apiVersion}/store_stocks/transfer_to_warehouse/<tenantId>`, // PUT
};
