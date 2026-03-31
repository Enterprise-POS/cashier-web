import { useQuery } from '@tanstack/react-query';

import { StoreStockV2 } from '@/_classes/StoreStock';
import { StoreStockV2Def } from '@/_interface/StoreStockDef';
import { getAllV2 } from '@/_lib/store_stock';
import { useStore } from '@/components/provider/StoreProvider';
import { useManageStocksStore } from '@/components/store/manageStocksStore';

export function useManageStocksQuery(token: string) {
	const storeCtx = useStore();
	const { pagination, appliedNameQuery, appliedCategoryId, appliedAscending } = useManageStocksStore();

	const storeId = storeCtx.data.selectedStoreId;
	const tenantId = storeCtx.getCurrentTenantId();

	return useQuery({
		queryKey: [
			'storeStocks',
			tenantId,
			storeId,
			pagination.current,
			pagination.pageSize,
			appliedNameQuery,
			appliedCategoryId,
			appliedAscending,
		],
		queryFn: async () => {
			const { result, error } = await getAllV2(
				storeId,
				tenantId,
				pagination.current!,
				pagination.pageSize!,
				appliedNameQuery,
				appliedCategoryId,
				token,
			);

			if (error !== null) {
				// Special case — no stock found is not a real error
				if (error.includes('[ERROR] no stock found') || error.includes('Fatal error: no stock found')) {
					return { storeStocks: [], total: 0 };
				}
				throw new Error(error);
			}

			return {
				storeStocks: result!.storeStockDefs.map((def: StoreStockV2Def) => new StoreStockV2(def)),
				total: result!.count,
			};
		},
		enabled: storeId !== 0 && tenantId !== 0,
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
}
