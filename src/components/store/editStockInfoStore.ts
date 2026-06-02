import { QueryClient } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
import { create } from 'zustand';

import { StoreStockV2 } from '@/_classes/StoreStock';
import { HTTPResult } from '@/_interface/HTTPResult';
import { editStoreStock } from '@/_lib/store_stock';
import { closeBootstrapModal } from '@/_lib/utils';
import { SortBy } from '@/components/core/data/constant';

const INITIAL_PAGINATION: TablePaginationConfig = {
	current: 1,
	pageSize: 10,
	total: 0,
	responsive: true,
};

type FeedbackState = {
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	errorMessage: string;
	successMessage: string;
};

type FilterState = {
	nameQuery: string;
	sortCreatedAt: SortBy;
	appliedNameQuery: string;
};

type EditStockInfoActions = {
	setLoading: (loading: boolean) => void;
	setError: (message: string) => void;
	setSuccess: (message: string) => void;
	clearError: () => void;
	clearSuccess: () => void;

	setPagination: (pagination: TablePaginationConfig) => void;
	setNameQuery: (query: string) => void;
	setCreatedAtSorter: (sortBy: SortBy) => void;
	applyFilters: () => void;
	resetFilters: () => void;

	handleSortChange: (sorter: SorterResult<StoreStockV2> | SorterResult<StoreStockV2>[]) => void;
	handleConfirmEdit: (
		formData: FormData,
		token: string,
		queryClient: QueryClient,
		isFetching: boolean,
	) => Promise<void>;
};

type EditStockInfoStore = { pagination: TablePaginationConfig } & FeedbackState & FilterState & EditStockInfoActions;

export const useEditStockInfoStore = create<EditStockInfoStore>((set, get) => ({
	pagination: INITIAL_PAGINATION,

	isLoading: false,
	isError: false,
	isSuccess: false,
	errorMessage: '',
	successMessage: '',

	nameQuery: '',
	appliedNameQuery: '',
	sortCreatedAt: SortBy.ASCENDING,

	setLoading: loading => set({ isLoading: loading }),
	setError: message => set({ isError: true, isSuccess: false, errorMessage: message }),
	setSuccess: message => set({ isSuccess: true, isError: false, successMessage: message }),
	clearError: () => set({ isError: false, errorMessage: '' }),
	clearSuccess: () => set({ isSuccess: false, successMessage: '' }),

	setPagination: pagination => set({ pagination }),
	setNameQuery: query => set({ nameQuery: query }),
	setCreatedAtSorter: sortBy => set({ sortCreatedAt: sortBy }),

	applyFilters: () => {
		const { nameQuery, pagination } = get();
		set({ appliedNameQuery: nameQuery, pagination: { ...INITIAL_PAGINATION, total: pagination.total } });
	},
	resetFilters: () =>
		set({ nameQuery: '', appliedNameQuery: '', sortCreatedAt: SortBy.ASCENDING, pagination: INITIAL_PAGINATION }),

	handleSortChange: (sorter: SorterResult<StoreStockV2> | SorterResult<StoreStockV2>[]) => {
		const { setCreatedAtSorter, applyFilters } = get();

		if (!Array.isArray(sorter)) {
			if (sorter.field === 'createdAt') {
				setCreatedAtSorter(sorter.order === 'ascend' ? SortBy.ASCENDING : SortBy.DESCENDING);
				applyFilters();
			}
		}
	},
	handleConfirmEdit: async (formData, token, queryClient, isFetching) => {
		if (isFetching) return;

		const { setLoading, setError, setSuccess } = get();
		setLoading(true);

		try {
			const { error }: HTTPResult<void> = await editStoreStock(formData, token);
			if (error !== null) {
				setError(error);
				return;
			}

			setSuccess('Edited successfully');
			queryClient.invalidateQueries({ queryKey: ['editStockInfo'] });
			closeBootstrapModal('#edit-units [data-bs-dismiss="modal"]');
		} catch (e) {
			setError(`Unexpected error: ${(e as Error).message}`);
		} finally {
			setLoading(false);
		}
	},
}));
