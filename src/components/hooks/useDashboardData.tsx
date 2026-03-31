// hooks/useHomeDashboardQueries.ts
import { useQuery } from '@tanstack/react-query';
import { orderItemSalesReport, orderItemGetSearch } from '@/_lib/new_order_item';
import { DateFilter } from '@/_interface/DateFilter';
import { HTTPResult } from '@/_interface/HTTPResult';
import { ReportResultDef } from '@/_interface/ReportResultDef';
import { OrderItemDef } from '@/_interface/OrderItemDef.js';

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
		select: (data: HTTPResult<ReportResultDef>) => {
			if (data.error) throw new Error(data.error); // Set ReactQuery as error response by throwing an error
			return data;
		},
	});

	const orderItemsQuery = useQuery({
		queryKey: ['orderItems', tenantId, storeId, page, pageSize, dateFilter],
		queryFn: () => orderItemGetSearch(tenantId, storeId, pageSize, page, dateFilter),
		enabled: tenantId !== 0,
		staleTime: 1000 * 60 * 5,
		select: (data: HTTPResult<{ defs: OrderItemDef[]; total_count: number }>) => {
			if (data.error) throw new Error(data.error);
			return data;
		},
	});

	return { salesQuery, orderItemsQuery };
}
