import { useQuery } from '@tanstack/react-query';

import { StoreStockV2 } from '@/_classes/StoreStock';
import { HTTPResult } from '@/_interface/HTTPResult';
import { StoreStockV2Def } from '@/_interface/StoreStockDef';
import { getAllV2 } from '@/_lib/store_stock';
import { buildQueryFilters } from '@/_lib/utils';
import { useStore } from '@/components/provider/StoreProvider';
import { useManageStocksStore } from '@/components/store/manageStocksStore';

export function useManageStocksQuery(token: string) {
	const storeCtx = useStore();
	const { pagination, appliedNameQuery, appliedCategoryId, appliedSorts } = useManageStocksStore();

	// Derive state
	const storeId = storeCtx.data.selectedStoreId;
	const tenantId = storeCtx.getCurrentTenantId();
	const queryFilters = buildQueryFilters(appliedSorts);

	return useQuery({
		queryKey: [
			'storeStocks',
			tenantId,
			storeId,
			pagination.current,
			pagination.pageSize,
			appliedNameQuery,
			appliedCategoryId,
			appliedSorts,
		],
		queryFn: () =>
			getAllV2(
				storeId,
				tenantId,
				pagination.current!,
				pagination.pageSize!,
				appliedNameQuery,
				appliedCategoryId,
				queryFilters,
				token,
			),
		select: (data: HTTPResult<{ count: number; storeStockDefs: StoreStockV2Def[] }>) => {
			if (data.error) throw new Error(data.error); // Set ReactQuery as error response by throwing an error
			return {
				storeStocks: data.result!.storeStockDefs.map((def: StoreStockV2Def) => new StoreStockV2(def)),
				total: data.result!.count,
			};
		},
		enabled: storeId !== 0 && tenantId !== 0,
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
}
