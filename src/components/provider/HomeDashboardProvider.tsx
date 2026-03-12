'use client';

import { useQueryClient } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd';
import dayjs from 'dayjs';
import { createContext, useContext, useMemo, useState } from 'react';

import {
	GetSalesReport,
	HomeDashboardEvent,
	OnChangeSelectedStore,
	OnClickErrorToastCloseButton,
	OnClickGenerateReport,
	OnSetDateRange,
} from '@/_classes/HomeDashboardEvent';
import { OrderItem } from '@/_classes/OrderItem';
import { ReportResult } from '@/_classes/ReportResult';
import { convertTo } from '@/_lib/utils';
import { useDashboardData } from '@/components/hooks/useDashboardData';
import { useStore } from '@/components/provider/StoreProvider';

const todayStart = dayjs().startOf('day');
const todayEnd = dayjs().endOf('day');

// This is what values user could change
export type HomeDashboardState = {
	dateRanges: [dayjs.Dayjs | null, dayjs.Dayjs | null];
	selectedStoreId: number;
	pagination: TablePaginationConfig;
};

const initialState: HomeDashboardState = {
	dateRanges: [todayStart, todayEnd],
	selectedStoreId: 0,
	pagination: { current: 1, pageSize: 20, total: 0, responsive: true },
};

type HomeDashboardContextType = {
	state: HomeDashboardState & { pagination: TablePaginationConfig };
	reportResult: ReportResult | undefined;
	orderItems: OrderItem[];
	isLoading: boolean;
	isError: boolean;
	errorMessage: string;
	stores: { value: string; label: string }[];
	selectedTenantId: number;
	onEvent: (event: HomeDashboardEvent) => void;
};

const HomeDashboardContext = createContext<HomeDashboardContextType | undefined>(undefined);

function HomeDashboardProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<HomeDashboardState>(initialState);
	const storeCtx = useStore();
	const queryClient = useQueryClient();

	const stores = storeCtx.data.storeList.map(s => ({
		value: String(s.id),
		label: s.name,
	}));

	const dateFilter = useMemo(
		() => ({
			column: 'created_at' as const,
			start_date: state.dateRanges[0]?.unix() ?? null,
			end_date: state.dateRanges[1]?.unix() ?? null,
		}),
		[state.dateRanges],
	);

	const { salesQuery, orderItemsQuery } = useDashboardData(
		storeCtx.getCurrentTenantId(),
		state.selectedStoreId,
		state.pagination.current!,
		state.pagination.pageSize!,
		dateFilter,
	);

	const isLoading = salesQuery.isLoading || orderItemsQuery.isLoading;
	const isError = salesQuery.isError || orderItemsQuery.isError;
	const errorMessage = salesQuery.error?.message || orderItemsQuery.error?.message || '';

	const reportResult = salesQuery.isSuccess ? new ReportResult(salesQuery.data.result!) : undefined;

	const orderItems = orderItemsQuery.isSuccess ? orderItemsQuery.data.result!.defs.map(def => new OrderItem(def)) : [];

	// Derive total from actual API response
	const total = orderItemsQuery.isSuccess ? orderItemsQuery.data.result!.total_count : 0;

	async function onEvent(event: HomeDashboardEvent) {
		if (storeCtx.getCurrentTenantId() === 0) return;

		if (event instanceof OnSetDateRange) {
			setState(v => ({ ...v, dateRanges: event.value }));
			return;
		}

		if (event instanceof OnClickGenerateReport) {
			// Just invalidate — TanStack refetches automatically
			setState(v => ({ ...v, pagination: initialState.pagination }));
			queryClient.invalidateQueries({ queryKey: ['salesReport'] });
			queryClient.invalidateQueries({ queryKey: ['orderItems'] });
			return;
		}

		if (event instanceof GetSalesReport) {
			// Updating page/pageSize changes the queryKey → TanStack auto-refetches
			setState(v => ({
				...v,
				pagination: {
					...v.pagination,
					current: event.page,
					pageSize: event.limit,
				},
			}));
			return;
		}

		if (event instanceof OnChangeSelectedStore) {
			const value = convertTo.number(event.storeId);
			if (value === null) return;
			setState(v => ({ ...v, selectedStoreId: value }));
			return;
		}

		if (event instanceof OnClickErrorToastCloseButton) {
			// TanStack handles this via query state — optionally reset
			salesQuery.refetch();
			orderItemsQuery.refetch();
			return;
		}
	}

	return (
		<HomeDashboardContext.Provider
			value={{
				state: {
					...state,
					pagination: {
						...state.pagination,
						total,
					},
				},
				reportResult,
				orderItems,
				isLoading,
				isError,
				errorMessage,
				stores,
				onEvent,
				selectedTenantId: storeCtx.getCurrentTenantId(),
			}}
		>
			{children}
		</HomeDashboardContext.Provider>
	);
}

function useHomeDashboard(): HomeDashboardContextType {
	const context = useContext(HomeDashboardContext);
	if (context === undefined) throw new Error('[DEV] useHomeDashboard must be used within a TenantProvider');

	return context;
}

export { HomeDashboardProvider, useHomeDashboard };
