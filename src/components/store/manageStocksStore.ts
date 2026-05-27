import { QueryClient } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd';
import { create } from 'zustand';

import { StoreStockV2 } from '@/_classes/StoreStock';
import { AllowedColumn, SortState } from '@/_interface/QueryFilter';
import { TransferStockRequest } from '@/_interface/TransferStock';
import { WithdrawProductFromStoreRequestValue } from '@/_interface/WithdrawProductFromStoreRequestBody';
import { transferStockToStoreStock, transferStockToWarehouse, withdrawStoreStock } from '@/_lib/store_stock';
import { closeBootstrapModal } from '@/_lib/utils';

const INITIAL_PAGINATION: TablePaginationConfig = {
	current: 1,
	pageSize: 10,
	total: 0,
	responsive: true,
};

const INITIAL_SORT: SortState = {
	column: AllowedColumn.createdAt,
	ascending: false,
};

const INITIAL_CATEGORY = {
	categoryId: 0,
	categoryName: 'unselected',
};

type Category = {
	categoryId: number;
	categoryName: string;
};

type FeedbackState = {
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	errorMessage: string;
	successMessage: string;
};

type FilterState = {
	// UI filter state (doesn't trigger fetch until applied)
	nameQuery: string;
	selectedCategory: Category;
	sorts: SortState[];

	// Applied filter state — queryKey reads these
	appliedNameQuery: string;
	appliedCategoryId: number;
	appliedSorts: SortState[];
};

type ManageStocksActions = {
	// Feedback
	setLoading: (loading: boolean) => void;
	setError: (message: string) => void;
	setSuccess: (message: string) => void;
	clearError: () => void;
	clearSuccess: () => void;

	// Data
	setStoreStocks: (stocks: StoreStockV2[]) => void;
	setPagination: (pagination: TablePaginationConfig) => void;

	// Filters
	setNameQuery: (query: string) => void;
	setSelectedCategory: (value: Category) => void;
	setSort: (sort: SortState) => void;
	applyFilters: () => void;
	resetFilters: () => void;

	// Async actions
	handleTransferItem: (
		transferStockRequest: TransferStockRequest,
		itemName: string,
		selectedStoreName: string,
		token: string,
		queryClient: QueryClient,
		isFetching: boolean,
	) => Promise<void>;

	handleTransferItems: (
		items: Array<{ req: TransferStockRequest; itemName: string }>,
		selectedStoreName: string,
		token: string,
		queryClient: QueryClient,
		isFetching: boolean,
	) => Promise<number[]>;

	handleConfirmEdit: (
		body: TransferStockRequest,
		token: string,
		queryClient: QueryClient,
		isFetching: boolean,
	) => Promise<void>;

	handleConfirmWithdraw: (
		body: WithdrawProductFromStoreRequestValue,
		token: string,
		queryClient: QueryClient,
		isFetching: boolean,
	) => Promise<void>;
};

/*
interface ManageStocksStore
    extends FeedbackState,
            FilterState,
            ManageStocksActions {
    storeStocks: StoreStockV2[];
    pagination: TablePaginationConfig;
}
*/
// prettier-ignore
type ManageStocksStore =
    & { storeStocks: StoreStockV2[]; pagination: TablePaginationConfig }
    & FeedbackState       // isLoading, isError, isSuccess...
    & FilterState         // nameQuery, sorts, appliedSorts...
    & ManageStocksActions // setLoading, setError, applyFilters...

export const useManageStocksStore = create<ManageStocksStore>((set, get) => ({
	// Data
	storeStocks: [],
	pagination: INITIAL_PAGINATION,

	// Feedback
	isLoading: false,
	isError: false,
	isSuccess: false,
	errorMessage: '',
	successMessage: '',

	// Filters
	nameQuery: '',
	selectedCategory: INITIAL_CATEGORY,
	sorts: [INITIAL_SORT],
	appliedNameQuery: '',
	appliedCategoryId: 0,
	appliedSorts: [INITIAL_SORT],

	// Feedback actions
	setLoading: loading => set({ isLoading: loading }),
	setError: message => set({ isError: true, isSuccess: false, errorMessage: message }),
	setSuccess: message => set({ isSuccess: true, isError: false, successMessage: message }),
	clearError: () => set({ isError: false, errorMessage: '' }),
	clearSuccess: () => set({ isSuccess: false, successMessage: '' }),

	// Data actions
	setStoreStocks: stocks => set({ storeStocks: stocks }),
	setPagination: pagination => set({ pagination }),

	// Filter actions
	setNameQuery: query => set({ nameQuery: query }),
	setSelectedCategory: value => set({ selectedCategory: value }),
	setSort: sort =>
		set(state => ({
			sorts: [...state.sorts.filter(s => s.column !== sort.column), sort],
		})),
	applyFilters: () => {
		const { nameQuery, selectedCategory, sorts } = get();
		set({
			appliedNameQuery: nameQuery,
			appliedCategoryId: selectedCategory.categoryId,
			appliedSorts: [...sorts],
			pagination: INITIAL_PAGINATION,
		});
	},
	resetFilters: () =>
		set({
			nameQuery: '',
			selectedCategory: INITIAL_CATEGORY,
			sorts: [INITIAL_SORT],
			pagination: INITIAL_PAGINATION,
		}),

	// Async actions
	handleTransferItem: async (transferStockRequest, itemName, selectedStoreName, token, queryClient, isFetching) => {
		if (isFetching) return;

		const { setLoading, setError, setSuccess, setNameQuery } = get();

		setLoading(true);
		try {
			const { error } = await transferStockToStoreStock(transferStockRequest, token);

			if (error !== null) {
				setError(error.includes('Not enough stock') ? 'Please make sure the new item is available at least 1' : error);
				return;
			}

			setNameQuery('');
			queryClient.invalidateQueries({ queryKey: ['storeStocks'] });
			setSuccess(`${itemName} successfully added to ${selectedStoreName}`);
			closeBootstrapModal('#add-units [data-bs-dismiss="modal"]');
		} catch (e) {
			setError(`Unexpected error: ${(e as Error).message}`);
		} finally {
			setLoading(false);
		}
	},

	handleTransferItems: async (items, selectedStoreName, token, queryClient, isFetching) => {
		if (isFetching) return [];

		const { setLoading, setError, setSuccess, setNameQuery } = get();

		setLoading(true);
		try {
			const results = await Promise.all(items.map(({ req }) => transferStockToStoreStock(req, token)));

			const failed = results
				.map((r, i) => ({ error: r.error, itemId: items[i].req.itemId, itemName: items[i].itemName }))
				.filter(r => r.error !== null);
			const successCount = results.length - failed.length;

			if (successCount > 0) {
				setNameQuery('');
				queryClient.invalidateQueries({ queryKey: ['storeStocks'] });
			}

			if (failed.length > 0) {
				const failedNames = failed.map(f => f.itemName).join(', ');
				const prefix = successCount > 0
					? `${successCount} of ${items.length} added to ${selectedStoreName}. `
					: '';
				setError(`${prefix}Failed to add: ${failedNames}`);
				return failed.map(f => f.itemId);
			}

			setSuccess(`${successCount} product${successCount > 1 ? 's' : ''} successfully added to ${selectedStoreName}`);
			closeBootstrapModal('#add-units [data-bs-dismiss="modal"]');
			return [];
		} catch (e) {
			setError(`Unexpected error: ${(e as Error).message}`);
			return items.map(i => i.req.itemId);
		} finally {
			setLoading(false);
		}
	},

	handleConfirmEdit: async (body: TransferStockRequest, token, queryClient, isFetching) => {
		if (isFetching || body.quantity === 0) return;

		const { setLoading, setError, setSuccess } = get();

		try {
			setLoading(true);
			let result;

			if (body.quantity > 0) result = await transferStockToStoreStock(body, token);
			else result = await transferStockToWarehouse({ ...body, quantity: -body.quantity }, token);

			const { error } = result;
			if (error !== null) {
				setError(error);
			} else {
				setSuccess('Product edited successfully');
				// Invalidate to refetch fresh data
				queryClient.invalidateQueries({ queryKey: ['storeStocks'] });
			}
		} catch (e) {
			const error = e as Error;
			setError(`Unexpected error: ${error.message}`);
		} finally {
			setLoading(false);
		}
	},

	handleConfirmWithdraw: async (body: WithdrawProductFromStoreRequestValue, token, queryClient, isFetching) => {
		if (isFetching) return;

		const { setLoading, setError, setSuccess } = get();

		try {
			setLoading(true);
			const { error } = await withdrawStoreStock(body, token);
			if (error !== null) {
				setError(error);
			} else {
				setSuccess(`${body.itemName} is successfully withdrawn`);
				queryClient.invalidateQueries({ queryKey: ['storeStocks'] });
			}
		} catch (e) {
			const error = e as Error;
			setError(`Unexpected error: ${error.message}`);
		} finally {
			setLoading(false);
		}
	},
}));
