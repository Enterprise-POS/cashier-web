import { useQuery } from '@tanstack/react-query';

import { getActiveWarehouseItem } from '@/_lib/warehouse';
import { Constants } from '@/components/core/data/constant';

export function useWarehouseItemsQuery(
	tenantId: number,
	page: number,
	nameQuery: string,
	enabled: boolean,
) {
	return useQuery({
		queryKey: [Constants.ReactQueryKey.warehouse, tenantId, page, nameQuery],
		queryFn: () => getActiveWarehouseItem(tenantId, 10, page, nameQuery),
		enabled: tenantId !== 0 && enabled,
		staleTime: 1000 * 60 * 5,
	});
}
