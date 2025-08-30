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
