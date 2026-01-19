'use client';

import { TablePaginationConfig } from 'antd';
import dayjs from 'dayjs';
import { createContext, useContext, useEffect, useState } from 'react';

import {
	GetSalesReport,
	HomeDashboardEvent,
	OnChangeSelectedStore,
	OnClickErrorToastCloseButton,
	OnClickGenerateReport,
	OnDateRangeOk,
	OnSetDateRange,
} from '@/_classes/HomeDashboardEvent';
import { OrderItem } from '@/_classes/OrderItem';
import { ReportResult } from '@/_classes/ReportResult';
import { DateFilter } from '@/_interface/DateFilter';
import { orderItemGetSearch, orderItemSalesReport } from '@/_lib/order_item';
import { convertTo } from '@/_lib/utils';
import { useFormState } from '@/components/hooks/useFormState';
import { useStore } from '@/components/provider/StoreProvider';

const todayStart = dayjs().startOf('day');
const todayEnd = dayjs().endOf('day');

// This is what values user could change
export type HomeDashboardState = {
	reportResult?: ReportResult;
	orderItems: OrderItem[];
	dateRanges: [dayjs.Dayjs | null, dayjs.Dayjs | null];
	pagination: TablePaginationConfig;

	// This is for selected store id report. Not related with any current selected store at StoreProvider
	selectedStoreId: number;
};

// Readonly / interact
type HomeDashboardContextType = {
	data: HomeDashboardState;
	isStateLoading: boolean;
	isError: boolean;
	errorMessage: string;
	selectedTenantId: number;
	stores: { value: string; label: string }[];
	onEvent: (event: HomeDashboardEvent) => void;
};

const initialState: HomeDashboardState = {
	reportResult: undefined,
	orderItems: [],
	dateRanges: [todayStart, todayEnd],
	selectedStoreId: 0,
	pagination: {
		current: 1,
		pageSize: 20,
		total: 0,
		responsive: true,
	},
};

const HomeDashboardContext = createContext<HomeDashboardContextType | undefined>(undefined);

function HomeDashboardProvider({ children }: { children: React.ReactNode }) {
	// Divided by 1000 because new Date() by default is in milliseconds
	// const today00h = Math.round(new Date().setHours(0, 0, 0) / 1000); // get today at 00:00 in epoch seconds
	// const today24h = Math.round(new Date().setHours(24, 0, 0) / 1000); // get today at 24:00 in epoch seconds

	const [homeDashboardState, setHomeDashboardState] = useState<HomeDashboardState>(initialState);
	const formState = useFormState();
	const storeCtx = useStore();
	const stores: { value: string; label: string }[] = storeCtx.data.storeList.map(s => ({
		value: String(s.id),
		label: s.name,
	}));

	async function _getSummaryInit(page: number, limit: number) {
		if (formState.state.isFormLoading) return;
		formState.setFormLoading(true);
		const dateFilter: DateFilter = {
			column: 'created_at' as const,
			start_date: homeDashboardState.dateRanges[0]?.unix() ?? null,
			end_date: homeDashboardState.dateRanges[1]?.unix() ?? null,
		};

		try {
			// Fetch both in parallel
			const [salesResult, orderItemsResult] = await Promise.all([
				orderItemSalesReport(storeCtx.getCurrentTenantId(), homeDashboardState.selectedStoreId, dateFilter),
				orderItemGetSearch(storeCtx.getCurrentTenantId(), homeDashboardState.selectedStoreId, limit, page, dateFilter),
			]);

			// Check for errors
			const error = salesResult.error || orderItemsResult.error;
			if (error) {
				setHomeDashboardState(initialState);
				formState.setError({ message: error });
				return;
			} else {
				setHomeDashboardState(v => ({
					...v,
					pagination: {
						current: page,
						pageSize: limit,
						total: orderItemsResult.result!.total_count,
					},
					reportResult: new ReportResult(salesResult.result!),
					orderItems: orderItemsResult.result!.defs.map(def => new OrderItem(def)),
				}));
				formState.setSuccess({ message: 'ok' });
			}
		} catch (err: unknown) {
			const error = err as Error;
			formState.setError({ message: error.message });
		} finally {
			formState.setFormLoading(false);
		}
	}

	async function onEvent(event: HomeDashboardEvent) {
		// If there is no tenant selected then it must be user not yet
		// select tenant or create any tenant
		if (storeCtx.getCurrentTenantId() === 0) {
			formState.setError({
				message:
					'Please make sure to select a tenant first. If you have not created a tenant yet, you can create one by clicking the “No Tenant” button at the top, then selecting “New Tenant.”',
			});
			return;
		}

		if (event instanceof OnDateRangeOk) {
			const value = event.value;
			return;
		}

		if (event instanceof OnSetDateRange) {
			const value = event.value;
			const dateString = event.dateString;

			//console.log(value, dateString);
			setHomeDashboardState(v => ({ ...v, dateRanges: value }));
			return;
		}

		if (event instanceof GetSalesReport) {
			const page = event.page;
			const limit = event.limit;

			if (formState.state.isFormLoading) return;
			formState.setFormLoading(true);
			const dateFilter: DateFilter = {
				column: 'created_at' as const,
				start_date: homeDashboardState.dateRanges[0]?.unix() ?? null,
				end_date: homeDashboardState.dateRanges[1]?.unix() ?? null,
			};

			try {
				// Fetch both in parallel
				const { result, error } = await orderItemGetSearch(
					storeCtx.getCurrentTenantId(),
					homeDashboardState.selectedStoreId,
					limit,
					page,
					dateFilter,
				);

				// Check for errors
				if (error) {
					setHomeDashboardState(initialState);
					formState.setError({ message: error });
					return;
				} else {
					setHomeDashboardState(v => ({
						...v,
						pagination: {
							current: page,
							pageSize: limit,
							total: result!.total_count,
						},
						orderItems: result!.defs.map(def => new OrderItem(def)),
					}));
					formState.setSuccess({ message: 'ok' });
				}
			} catch (err: unknown) {
				const error = err as Error;
				formState.setError({ message: error.message });
			} finally {
				formState.setFormLoading(false);
			}
			return;
		}

		if (event instanceof OnClickGenerateReport) {
			// When user click generate report it will reset the pagination
			setHomeDashboardState(v => ({ ...v, pagination: initialState.pagination }));
			_getSummaryInit(initialState.pagination.current!, initialState.pagination.pageSize!);
			return;
		}

		if (event instanceof OnChangeSelectedStore) {
			const value = convertTo.number(event.storeId);
			if (value === null) return;
			setHomeDashboardState(v => ({ ...v, selectedStoreId: value }));
			return;
		}

		if (event instanceof OnClickErrorToastCloseButton) {
			formState.setState({ error: false });
			return;
		}

		throw new Error('Unexpected user input');
	}

	useEffect(() => {
		// If selected tenant is 0, we know tenant ctx is not ready
		if (storeCtx.getCurrentTenantId() === 0) return;
		_getSummaryInit(initialState.pagination.current!, initialState.pagination.pageSize!);
	}, [storeCtx.getCurrentTenantId()]);

	return (
		<HomeDashboardContext.Provider
			value={{
				data: homeDashboardState,
				isStateLoading: formState.state.isFormLoading,
				isError: formState.state.isError,
				errorMessage: formState.value.errorMessage,
				selectedTenantId: storeCtx.getCurrentTenantId(),
				stores,
				onEvent,
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
