'use client';

import { TablePaginationConfig } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { createContext, useContext, useMemo, useState } from 'react';

import {
	GetSalesReport,
	HomeDashboardEvent,
	OnChangeSelectedStore,
	OnClickDeleteInvoiceBtn,
	OnClickErrorToastCloseButton,
	OnClickGenerateReport,
	OnClickRefreshBtn,
	OnClickYesDeleteInvoiceBtn,
	OnDismissExportError,
	OnSetDateRange,
	OnTagSelect,
	QuickFilterTag,
} from '@/_classes/HomeDashboardEvent';
import { OrderItem } from '@/_classes/OrderItem';
import { ReportResult } from '@/_classes/ReportResult';
import { orderItemDeleteInvoice, orderItemExportProfit } from '@/_lib/order_item';
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
	singleSelectedTag: QuickFilterTag;
	tobeDeletedInvoiceId: number;
};

const initialState: HomeDashboardState = {
	dateRanges: [todayStart, todayEnd],
	selectedStoreId: 0,
	pagination: { current: 1, pageSize: 20, total: 0, responsive: true },
	singleSelectedTag: QuickFilterTag.Today,
	tobeDeletedInvoiceId: 0,
};

type HomeDashboardContextType = {
	state: HomeDashboardState & { pagination: TablePaginationConfig };
	reportResult: ReportResult | undefined;
	orderItems: OrderItem[];
	isLoading: boolean;
	isExporting: boolean;
	exportError: string | null;
	isError: boolean;
	errorMessage: string;
	stores: { value: string; label: string }[];
	selectedTenantId: number;
	tobeDeletedInvoiceId: number;
	isDeletingInvoice: boolean;
	deleteInvoiceError: string | null;
	onEvent: (event: HomeDashboardEvent) => void;
};

const HomeDashboardContext = createContext<HomeDashboardContextType | undefined>(undefined);

function HomeDashboardProvider({ children, token }: { children: React.ReactNode; token: string }) {
	const [state, setState] = useState<HomeDashboardState>(initialState);
	const [isExporting, setIsExporting] = useState(false);
	const [exportError, setExportError] = useState<string | null>(null);
	const [isDeletingInvoice, setIsDeletingInvoice] = useState(false);
	const [deleteInvoiceError, setDeleteInvoiceError] = useState<string | null>(null);

	const storeCtx = useStore();

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
		token, // pass the token
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
			setIsExporting(true);
			setExportError(null);
			try {
				const result = await orderItemExportProfit(
					storeCtx.getCurrentTenantId(),
					state.selectedStoreId || null,
					dateFilter,
				);

				if (result.error) {
					setExportError(result.error);
					return;
				}

				const byteCharacters = atob(result.result!);
				const byteArray = new Uint8Array(byteCharacters.length);
				for (let i = 0; i < byteCharacters.length; i++) {
					byteArray[i] = byteCharacters.charCodeAt(i);
				}
				const blob = new Blob([byteArray], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				});
				const url = URL.createObjectURL(blob);
				const anchor = document.createElement('a');
				anchor.href = url;
				const timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss');
				anchor.download = `profit_report_${timestamp}.xlsx`;
				anchor.click();
				URL.revokeObjectURL(url);
			} catch (e) {
				setExportError(e instanceof Error ? e.message : 'Unknown error while exporting');
			} finally {
				setIsExporting(false);
			}
			return;
		}

		if (event instanceof OnDismissExportError) {
			setExportError(null);
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

		if (event instanceof OnTagSelect) {
			const tag = event.tag;
			// const checked = event.checked;

			setState(v => ({ ...v, singleSelectedTag: tag }));

			// Calculate the date range
			const now = dayjs();
			let start: Dayjs | null = null;
			let end: Dayjs | null = null;

			switch (tag) {
				case QuickFilterTag.Today:
					start = now.startOf('day');
					end = now.endOf('day');
					break;
				case QuickFilterTag.LastHour:
					start = now.subtract(1, 'hour');
					end = now;
					break;
				case QuickFilterTag.Last6Hours:
					start = now.subtract(6, 'hour');
					end = now;
					break;
				case QuickFilterTag.Last12Hours:
					start = now.subtract(12, 'hour');
					end = now;
					break;
				case QuickFilterTag.Last7Days:
					start = now.subtract(7, 'day').startOf('day');
					end = now.endOf('day');
					break;
				case QuickFilterTag.ThisMonth:
					start = now.startOf('month');
					end = now.endOf('month');
					break;
				case QuickFilterTag.Custom:
					return; // Let user pick manually, don't override
			}

			if (start && end) {
				// Recursive call OnSetDateRange that will set the date range picker
				onEvent(new OnSetDateRange([start, end], [start.format('YYYY-MM-DD HH:mm'), end.format('YYYY-MM-DD HH:mm')]));
			}
			return;
		}

		if (event instanceof OnClickDeleteInvoiceBtn) {
			const orderItemId = event.orderItemId;
			setState(v => ({ ...v, tobeDeletedInvoiceId: orderItemId }));
			return;
		}

		if (event instanceof OnClickYesDeleteInvoiceBtn) {
			if (isDeletingInvoice) return;

			const orderItemId = event.orderItemId;
			setIsDeletingInvoice(true);
			setDeleteInvoiceError(null);
			try {
				const { error } = await orderItemDeleteInvoice(orderItemId, storeCtx.getCurrentTenantId());

				if (error) {
					setDeleteInvoiceError(error);
					return;
				}

				// Reset the tobe deleted invoice id
				setState(v => ({ ...v, tobeDeletedInvoiceId: 0 }));

				// Refetch to reflect the deletion
				orderItemsQuery.refetch();
				salesQuery.refetch();
			} catch (e) {
				setDeleteInvoiceError(e instanceof Error ? e.message : 'Unknown error while deleting invoice');
			} finally {
				setIsDeletingInvoice(false);
			}

			return;
		}

		if (event instanceof OnClickRefreshBtn) {
			orderItemsQuery.refetch();
			salesQuery.refetch();
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
				tobeDeletedInvoiceId: state.tobeDeletedInvoiceId,
				reportResult,
				orderItems,
				isLoading,
				isExporting,
				exportError,
				isDeletingInvoice,
				deleteInvoiceError,
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
