import { create } from 'zustand';
import { TablePaginationConfig } from 'antd';

import { StoreStockV2 } from '@/_classes/StoreStock';

type ManageStocksStore = {
	// State
	storeStocks: StoreStockV2[];
	pagination: TablePaginationConfig;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	errorMessage: string;
	successMessage: string;

	// What user is currently selecting (UI only, doesn't trigger fetch)
	nameQuery: string;
	selectedCategory: { categoryId: number; categoryName: string };
	ascending: boolean;

	// Applied filters — only updates when user clicks Search
	// These are what queryKey reads from
	appliedNameQuery: string;
	appliedCategoryId: number;
	appliedAscending: boolean;

	// Actions
	setStoreStocks: (stocks: StoreStockV2[]) => void;
	setPagination: (pagination: TablePaginationConfig) => void;
	setNameQuery: (query: string) => void;
	setSelectedCategory: (value: { categoryId: number; categoryName: string }) => void;
	setAscending: (asc: boolean) => void;
	setLoading: (loading: boolean) => void;
	setError: (message: string) => void;
	setSuccess: (message: string) => void;
	clearError: () => void;
	clearSuccess: () => void;

	applyFilters: () => void;
	resetFilters: () => void;
};

const initialPagination: TablePaginationConfig = { current: 1, pageSize: 10, total: 0, responsive: true };

export const useManageStocksStore = create<ManageStocksStore>((set, get) => ({
	// UI filter state
	nameQuery: '',
	selectedCategory: { categoryId: 0, categoryName: 'unselected' },
	ascending: false,

	// Applied filter state — queryKey reads these
	appliedNameQuery: '',
	appliedCategoryId: 0,
	appliedAscending: false,

	storeStocks: [],
	pagination: initialPagination,
	isLoading: false,
	isError: false,
	isSuccess: false,
	errorMessage: '',
	successMessage: '',

	setStoreStocks: stocks => set({ storeStocks: stocks }),
	setPagination: pagination => set({ pagination }),
	setNameQuery: query => set({ nameQuery: query }),
	setSelectedCategory: value => set({ selectedCategory: value }),
	setAscending: asc => set({ ascending: asc }),
	setLoading: loading => set({ isLoading: loading }),
	setError: message => set({ isError: true, isSuccess: false, errorMessage: message }),
	setSuccess: message => set({ isSuccess: true, isError: false, successMessage: message }),
	clearError: () => set({ isError: false, errorMessage: '' }),
	clearSuccess: () => set({ isSuccess: false, successMessage: '' }),

	applyFilters: () => {
		const { nameQuery, selectedCategory, ascending } = get();
		set({
			appliedNameQuery: nameQuery,
			appliedCategoryId: selectedCategory.categoryId,
			appliedAscending: ascending,
			pagination: initialPagination, // reset to page 1
		});
	},

	resetFilters: () =>
		set({
			nameQuery: '',
			selectedCategory: { categoryId: 0, categoryName: 'unselected' },
			ascending: false,
			pagination: { current: 1, pageSize: 10, total: 0, responsive: true },
		}),
}));
