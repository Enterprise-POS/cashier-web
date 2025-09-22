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
	editWarehouseItem: `${baseURL}/${apiVersion}/warehouses/edit/<tenantId>`, // PUT
	warehouseSetActivate: `${baseURL}/${apiVersion}/warehouses/activate/<tenantId>`, // PUT

	// category
	getCategories: `${baseURL}/${apiVersion}/categories/<tenantId>`, // GET
	addCategory: `${baseURL}/${apiVersion}/categories/create/<tenantId>`, // POST
	updateCategory: `${baseURL}/${apiVersion}/categories/update/<tenantId>`, // PUT
	deleteCategory: `${baseURL}/${apiVersion}/categories/<tenantId>`, // DELETE
};
