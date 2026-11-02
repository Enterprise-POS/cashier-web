import { TablePaginationConfig } from 'antd';
import { create } from 'zustand';

import { VoucherType } from '@/_interface/VoucherDef';

export type VoucherSortColumn = 'code' | 'created_at' | 'name';
export type VoucherSortOrder = 'asc' | 'desc';

const INITIAL_PAGINATION: TablePaginationConfig = {
	current: 1,
	pageSize: 20,
	total: 0,
	responsive: true,
	showSizeChanger: false,
};

type VoucherStore = {
	pagination: TablePaginationConfig;
	voucherType: VoucherType | null;
	sortColumn: VoucherSortColumn | null;
	sortOrder: VoucherSortOrder | null;
	errorMessage: string;
	successMessage: string;
	setPagination: (pagination: TablePaginationConfig) => void;
	setVoucherType: (voucherType: VoucherType | null) => void;
	setSort: (column: VoucherSortColumn | null, order: VoucherSortOrder | null) => void;
	setError: (message: string) => void;
	setSuccess: (message: string) => void;
	clearFeedback: () => void;
};

export const useVoucherStore = create<VoucherStore>(set => ({
	pagination: INITIAL_PAGINATION,
	voucherType: null,
	sortColumn: null,
	sortOrder: null,
	errorMessage: '',
	successMessage: '',
	setPagination: pagination => set({ pagination }),
	setVoucherType: voucherType => set(state => ({
		voucherType,
		pagination: { ...state.pagination, current: 1 },
	})),
	setSort: (sortColumn, sortOrder) => set({ sortColumn, sortOrder }),
	setError: errorMessage => set({ errorMessage, successMessage: '' }),
	setSuccess: successMessage => set({ successMessage, errorMessage: '' }),
	clearFeedback: () => set({ errorMessage: '', successMessage: '' }),
}));
