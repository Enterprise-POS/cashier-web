import { QueryClient } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd';
import { create } from 'zustand';

import { HTTPResult } from '@/_interface/HTTPResult';
import type { SortState } from '@/_interface/QueryFilter';
import { editStoreStock } from '@/_lib/store_stock';
import { closeBootstrapModal } from '@/_lib/utils';
import { Constants } from '@/components/core/data/constant';

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
	sorts: SortState[];
	appliedNameQuery: string;
	appliedSorts: SortState[];
};

type EditStockInfoActions = {
	setLoading: (loading: boolean) => void;
	setError: (message: string) => void;
	setSuccess: (message: string) => void;
	clearError: () => void;
	clearSuccess: () => void;

	setPagination: (pagination: TablePaginationConfig) => void;
	setNameQuery: (query: string) => void;
	applyFilters: () => void;
	resetFilters: () => void;

	handleSortChange: (sorts: SortState[]) => void;
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
	sorts: [{ column: 'created_at', ascending: true }],
	appliedSorts: [{ column: 'created_at', ascending: true }],

	setLoading: loading => set({ isLoading: loading }),
	setError: message => set({ isError: true, isSuccess: false, errorMessage: message }),
	setSuccess: message => set({ isSuccess: true, isError: false, successMessage: message }),
	clearError: () => set({ isError: false, errorMessage: '' }),
	clearSuccess: () => set({ isSuccess: false, successMessage: '' }),

	setPagination: pagination => set({ pagination }),
	setNameQuery: query => set({ nameQuery: query }),
	handleSortChange: sorts => {
		const { nameQuery, pagination } = get();
		set({
			sorts,
			appliedNameQuery: nameQuery,
			appliedSorts: sorts,
			pagination: { ...INITIAL_PAGINATION, total: pagination.total },
		});
	},

	applyFilters: () => {
		const { nameQuery, sorts, pagination } = get();
		set({
			appliedNameQuery: nameQuery,
			appliedSorts: [...sorts],
			pagination: { ...INITIAL_PAGINATION, total: pagination.total },
		});
	},
	resetFilters: () =>
		set({
			nameQuery: '',
			appliedNameQuery: '',
			sorts: [{ column: 'created_at', ascending: true }],
			appliedSorts: [{ column: 'created_at', ascending: true }],
			pagination: INITIAL_PAGINATION,
		}),
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
			queryClient.invalidateQueries({ queryKey: [Constants.ReactQueryKey.editStockInfo] });
			closeBootstrapModal('#edit-units [data-bs-dismiss="modal"]');
		} catch (e) {
			setError(`Unexpected error: ${(e as Error).message}`);
		} finally {
			setLoading(false);
		}
	},
}));
