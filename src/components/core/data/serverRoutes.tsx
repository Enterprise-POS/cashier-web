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
	getWarehouseItem: `${baseURL}/${apiVersion}/warehouses/<tenantId>`,
};
