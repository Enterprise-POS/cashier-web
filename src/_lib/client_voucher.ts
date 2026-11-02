import { CreateVoucherRequest, EditVoucherRequest, VoucherListResponse, VoucherType } from '@/_interface/VoucherDef';
import { authorizedRequest, ensureSuccess } from '@/_lib/utils';
import { server_routes } from '@/components/core/data/server_routes';

function voucherUrl(tenantId: number) {
	return server_routes.vouchers.replace('<tenantId>', tenantId.toString());
}

export async function getVouchers(
	tenantId: number,
	page: number,
	limit: number,
	sort: string | null,
	voucherType: VoucherType | null,
	token: string,
): Promise<VoucherListResponse> {
	const params = new URLSearchParams({ limit: limit.toString(), page: page.toString() });
	if (sort) params.set('sort', sort);
	if (voucherType) params.set('voucher_type', voucherType);

	const response = await fetch(`${voucherUrl(tenantId)}?${params.toString()}`, {
		...authorizedRequest(token, 'GET'),
		cache: 'no-store',
	});
	await ensureSuccess(response);

	const payload = (await response.json()) as { data: VoucherListResponse };
	return payload.data;
}

export async function createVoucher(tenantId: number, body: CreateVoucherRequest, token: string): Promise<void> {
	const response = await fetch(voucherUrl(tenantId), authorizedRequest(token, 'POST', body));
	await ensureSuccess(response);
}

export async function editVoucher(
	tenantId: number,
	voucherId: number,
	body: EditVoucherRequest,
	token: string,
): Promise<void> {
	const response = await fetch(
		`${voucherUrl(tenantId)}/${voucherId}`,
		authorizedRequest(token, 'PUT', body),
	);
	await ensureSuccess(response);
}

export async function deleteVoucher(tenantId: number, voucherId: number, token: string): Promise<void> {
	const response = await fetch(`${voucherUrl(tenantId)}/${voucherId}`, authorizedRequest(token, 'DELETE'));
	await ensureSuccess(response);
}
