// hooks/useHomeDashboardQueries.ts
import { DateFilter } from '@/_interface/DateFilter';
import { HTTPResult } from '@/_interface/HTTPResult';
import { OrderItemDef } from '@/_interface/OrderItemDef';
import { ReportResultDef } from '@/_interface/ReportResultDef';
import { orderItemGetSearch, orderItemSalesReport } from '@/_lib/client_order_item';
import { Constants } from '@/components/core/data/constant';

import { useQuery } from '@tanstack/react-query';

export function useDashboardData(
	tenantId: number,
	storeId: number,
	page: number,
	pageSize: number,
	dateFilter: DateFilter,
	token: string,
) {
	const salesQuery = useQuery({
		queryKey: [Constants.ReactQueryKey.salesReport, tenantId, storeId, dateFilter],
		queryFn: () => orderItemSalesReport(tenantId, storeId, dateFilter, token),
		enabled: tenantId !== 0,
		staleTime: 1000 * 60 * 5, // cache for 5 min
		select: (data: HTTPResult<ReportResultDef>) => {
			if (data.error) throw new Error(data.error); // Set ReactQuery as error response by throwing an error
			return data;
		},
	});

	const orderItemsQuery = useQuery({
		queryKey: [Constants.ReactQueryKey.orderItems, tenantId, storeId, page, pageSize, dateFilter],
		queryFn: () => orderItemGetSearch(tenantId, storeId, pageSize, page, dateFilter, token),
		enabled: tenantId !== 0,
		staleTime: 1000 * 60 * 5,
		select: (data: HTTPResult<{ defs: OrderItemDef[]; total_count: number }>) => {
			if (data.error) throw new Error(data.error);
			return data;
		},
	});

	return { salesQuery, orderItemsQuery };
}
