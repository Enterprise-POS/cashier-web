import { useQuery } from '@tanstack/react-query';

import { Category } from '@/_classes/Category';
import { CategoryWithItem } from '@/_classes/Item';
import { CategoryDef, CategoryWithItemDef } from '@/_interface/CategoryDef';
import { HTTPResult } from '@/_interface/HTTPResult';
import { getCategories } from '@/_lib/category';
import { getCategoryWithItems } from '@/_lib/client_category';
import { useProductListStore } from '@/components/store/productListStore';

export function useProductListQuery(token: string, tenantId: number) {
	const { pagination, appliedNameQuery, appliedCategoryId, appliedSort } = useProductListStore();

	return useQuery({
		queryKey: [
			'productList',
			tenantId,
			pagination.current,
			pagination.pageSize,
			appliedNameQuery,
			appliedCategoryId,
			appliedSort,
		],
		queryFn: () =>
			getCategoryWithItems(
				pagination.current!,
				pagination.pageSize!,
				appliedNameQuery,
				tenantId,
				token,
				appliedCategoryId,
				appliedSort,
			),
		select: (data: HTTPResult<{ items: CategoryWithItemDef[]; count: number }>) => {
			if (data.error) throw new Error(data.error);

			return {
				products: data.result!.items.map(def => new CategoryWithItem(def)),
				total: data.result!.count,
			};
		},
		enabled: tenantId !== 0,
		staleTime: 0,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
}

export function useProductCategoriesQuery(tenantId: number) {
	return useQuery({
		queryKey: ['productCategories', tenantId],
		queryFn: () => getCategories(tenantId, 1, 100, ''),
		select: (data: HTTPResult<{ categoryDefs: CategoryDef[]; count: number }>) => {
			if (data.error) throw new Error(data.error);
			return data.result!.categoryDefs.map(def => new Category(def));
		},
		enabled: tenantId !== 0,
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
}
