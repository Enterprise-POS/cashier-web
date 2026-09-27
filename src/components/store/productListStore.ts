import { QueryClient } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd';
import { create } from 'zustand';

import { QueryFilter } from '@/_interface/QueryFilter';
import { setItemActivate } from '@/_lib/warehouse';
import { Constants } from '@/components/core/data/constant';

const INITIAL_PAGINATION: TablePaginationConfig = {
	current: 1,
	pageSize: 10,
	total: 0,
	responsive: true,
};

const INITIAL_CATEGORY = {
	categoryId: 0,
	categoryName: 'unselected',
};

const INITIAL_SORT = null;

type Category = {
	categoryId: number;
	categoryName: string;
};

export type ProductListSortColumn = 'item_name' | 'created_at';

export interface ProductListSort extends QueryFilter {
	column: ProductListSortColumn;
}

type FeedbackState = {
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	errorMessage: string;
	successMessage: string;
};

type FilterState = {
	nameQuery: string;
	selectedCategory: Category;
	sort: ProductListSort | null;
	appliedNameQuery: string;
	appliedCategoryId: number;
	appliedSort: ProductListSort | null;
};

type ProductListActions = {
	setLoading: (loading: boolean) => void;
	setError: (message: string) => void;
	setSuccess: (message: string) => void;
	clearError: () => void;
	clearSuccess: () => void;
	setPagination: (pagination: TablePaginationConfig) => void;
	setNameQuery: (query: string) => void;
	setSelectedCategory: (value: Category) => void;
	applyTableChange: (category: Category, sort: ProductListSort | null) => void;
	applyFilters: () => void;
	resetFilters: () => void;
	handleRemoveItem: (
		itemName: string,
		itemId: number,
		tenantId: number,
		queryClient: QueryClient,
		isFetching: boolean,
	) => Promise<void>;
};

type ProductListStore = { pagination: TablePaginationConfig } & FeedbackState & FilterState & ProductListActions;

export const useProductListStore = create<ProductListStore>((set, get) => ({
	pagination: INITIAL_PAGINATION,

	isLoading: false,
	isError: false,
	isSuccess: false,
	errorMessage: '',
	successMessage: '',

	nameQuery: '',
	selectedCategory: INITIAL_CATEGORY,
	sort: INITIAL_SORT,
	appliedNameQuery: '',
	appliedCategoryId: 0,
	appliedSort: INITIAL_SORT,

	setLoading: loading => set({ isLoading: loading }),
	setError: message => set({ isError: true, isSuccess: false, errorMessage: message }),
	setSuccess: message => set({ isSuccess: true, isError: false, successMessage: message }),
	clearError: () => set({ isError: false, errorMessage: '' }),
	clearSuccess: () => set({ isSuccess: false, successMessage: '' }),

	setPagination: pagination => set({ pagination }),
	setNameQuery: query => set({ nameQuery: query }),
	setSelectedCategory: value => set({ selectedCategory: value }),
	applyTableChange: (category, sort) => {
		const { nameQuery } = get();
		set({
			selectedCategory: category,
			sort,
			appliedNameQuery: nameQuery,
			appliedCategoryId: category.categoryId,
			appliedSort: sort,
			pagination: { ...INITIAL_PAGINATION },
		});
	},
	applyFilters: () => {
		const { nameQuery, selectedCategory, sort } = get();
		set({
			appliedNameQuery: nameQuery,
			appliedCategoryId: selectedCategory.categoryId,
			appliedSort: sort,
			pagination: { ...INITIAL_PAGINATION },
		});
	},
	resetFilters: () =>
		set({
			nameQuery: '',
			selectedCategory: INITIAL_CATEGORY,
			sort: INITIAL_SORT,
			appliedNameQuery: '',
			appliedCategoryId: 0,
			appliedSort: INITIAL_SORT,
			pagination: { ...INITIAL_PAGINATION },
		}),

	handleRemoveItem: async (itemName, itemId, tenantId, queryClient, isFetching) => {
		if (isFetching) return;

		const { setLoading, setError, setSuccess } = get();

		try {
			setLoading(true);
			const { error } = await setItemActivate(itemId, tenantId, false);

			if (error !== null) {
				setError(error);
				return;
			}

			queryClient.invalidateQueries({ queryKey: [Constants.ReactQueryKey.productList] });
			setSuccess(`${itemName} removed`);
		} catch (e) {
			setError(`Unexpected error: ${(e as Error).message}`);
		} finally {
			setLoading(false);
		}
	},
}));
