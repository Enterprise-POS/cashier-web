import { useQuery } from '@tanstack/react-query';

import { Voucher } from '@/_classes/Voucher';
import { getVouchers } from '@/_lib/client_voucher';
import { minutes } from '@/_lib/utils';
import { Constants } from '@/components/core/data/constant';
import { useVoucherStore } from '@/components/store/voucherStore';

export function useVouchersQuery(tenantId: number, token: string) {
	const { pagination, sortColumn, sortOrder } = useVoucherStore();
	const voucherType = useVoucherStore(state => state.voucherType);
	const sort = sortColumn && sortOrder ? `${sortColumn}:${sortOrder}` : null;

	return useQuery({
		queryKey: [
			Constants.ReactQueryKey.vouchers,
			tenantId,
			pagination.current,
			pagination.pageSize,
			sort,
			voucherType,
		],
		queryFn: () =>
			getVouchers(tenantId, pagination.current ?? 1, pagination.pageSize ?? 20, sort, voucherType, token),
		select: response => ({
			vouchers: response.vouchers.map(def => new Voucher(def)),
			count: response.count,
		}),
		enabled: tenantId !== 0 && token.length > 0,
		staleTime: minutes(1),
		refetchOnWindowFocus: false,
	});
}
