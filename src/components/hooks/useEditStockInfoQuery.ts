import { useQuery } from '@tanstack/react-query';

import { StoreStockV2 } from '@/_classes/StoreStock';
import { HTTPResult } from '@/_interface/HTTPResult';
import { StoreStockV2Def } from '@/_interface/StoreStockDef';
import { getAllV2 } from '@/_lib/store_stock';
import { useStore } from '@/components/provider/StoreProvider';
import { useTenant } from '@/components/provider/TenantProvider';
import { useEditStockInfoStore } from '@/components/store/editStockInfoStore';
import { SortBy } from '@/components/core/data/constant';

export function useEditStockInfoQuery(token: string) {
	const storeCtx = useStore();
	const tenantCtx = useTenant();
	const { pagination, appliedNameQuery, sortCreatedAt } = useEditStockInfoStore();

	const storeId = storeCtx.data.selectedStoreId;
	const tenantId = storeCtx.getCurrentTenantId();

	return useQuery({
		queryKey: [
			'editStockInfo',
			tenantId,
			storeId,
			pagination.current,
			pagination.pageSize,
			appliedNameQuery,
			sortCreatedAt,
		],
		queryFn: () =>
			getAllV2(
				storeId,
				tenantId,
				pagination.current!,
				pagination.pageSize!,
				appliedNameQuery,
				0, // categoryId — not used on this page
				[{ ascending: sortCreatedAt === SortBy.ASCENDING, column: 'created_at' }],
				token,
			),
		select: (data: HTTPResult<{ count: number; storeStockDefs: StoreStockV2Def[] }>) => {
			if (data.error) throw new Error(data.error);
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
