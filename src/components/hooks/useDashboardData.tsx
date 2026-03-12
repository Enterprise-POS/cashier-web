// hooks/useHomeDashboardQueries.ts
import { useQuery } from '@tanstack/react-query';
import { orderItemSalesReport, orderItemGetSearch } from '@/_lib/new_order_item';
import { DateFilter } from '@/_interface/DateFilter';

export function useDashboardData(
	tenantId: number,
	storeId: number,
	page: number,
	pageSize: number,
	dateFilter: DateFilter,
) {
	const salesQuery = useQuery({
		queryKey: ['salesReport', tenantId, storeId, dateFilter],
		queryFn: () => orderItemSalesReport(tenantId, storeId, dateFilter),
		enabled: tenantId !== 0,
		staleTime: 1000 * 60 * 5, // cache for 5 min
	});

	const orderItemsQuery = useQuery({
		queryKey: ['orderItems', tenantId, storeId, page, pageSize, dateFilter],
		queryFn: () => orderItemGetSearch(tenantId, storeId, pageSize, page, dateFilter),
		enabled: tenantId !== 0,
		staleTime: 1000 * 60 * 5,
	});

	return { salesQuery, orderItemsQuery };
}
