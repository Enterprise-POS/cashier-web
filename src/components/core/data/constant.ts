const CookieKey = {
	/*
		Backend will send the cookie. Authentication cookie will be this name
	*/
	enterprisePOS: '_enterprise_pos',
};

const HeaderKey = {
	/*
		Typically when at the app itself we only use this header.
		This header contains JWT payload = already the info <Auth>
	*/
	xEnterprisePayload: 'x-enterprise-payload',

	/*
		The token itself
	*/
	xEnterprisePayloadToken: 'x-enterprise-payload-token',
};

const LocalStorageKey = {
	currentSelectedTenant: 'current-selected-tenant',
};

export const Constants = {
	CookieKey,
	HeaderKey,
	LocalStorageKey,
};

export const StatusCode = {
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
};
