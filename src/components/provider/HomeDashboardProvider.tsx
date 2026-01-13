'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { OrderItem } from '@/_classes/OrderItem';
import { ReportResult } from '@/_classes/ReportResult';
import { orderItemGetSearch, orderItemSalesReport } from '@/_lib/order_item';
import { useFormState } from '@/components/hooks/useFormState';
import { useTenant } from '@/components/provider/TenantProvider';

export type HomeDashboardState = {
	reportResult?: ReportResult;
	orderItems: OrderItem[];
};

type HomeDashboardContextType = {
	data: HomeDashboardState;
	isStateLoading: boolean;
	isError: boolean;
};

const initialState: HomeDashboardState = {
	reportResult: undefined,
	orderItems: [],
};

const HomeDashboardContext = createContext<HomeDashboardContextType | undefined>(undefined);

function HomeDashboardProvider({ children }: { children: React.ReactNode }) {
	// Divided by 1000 because new Date() by default is in milliseconds
	const today00h = Math.round(new Date().setHours(0, 0, 0) / 1000); // get today at 00:00 in epoch seconds
	const today24h = Math.round(new Date().setHours(24, 0, 0) / 1000); // get today at 24:00 in epoch seconds

	const { data: tenantCtx } = useTenant(); // Depend on TenantProvider
	const [homeDashboardState, setHomeDashboardState] = useState<HomeDashboardState>(initialState);
	const formState = useFormState();

	async function getSummary() {
		if (formState.state.isFormLoading) return;
		formState.setFormLoading(true);

		try {
			const { result, error } = await orderItemSalesReport(tenantCtx.selectedTenantId, 0, {
				// The backend don't need to specify this property
				// but keep to it easier to understand keep specify it
				column: 'created_at',
				start_date: today00h,
				end_date: today24h,
			});
			const { result: result2, error: error2 } = await orderItemGetSearch(tenantCtx.selectedTenantId, 0, 20, 1, {
				column: 'created_at',
				start_date: today00h,
				end_date: today24h,
			});
			if (error !== null || error2 !== null) {
				// Reset the state
				setHomeDashboardState(initialState);
				if (error) {
					formState.setError({ message: error });
				} else if (error2) {
					formState.setError({ message: error2! });
				}
			} else {
				setHomeDashboardState(v => ({
					...v,
					reportResult: new ReportResult(result!),
					orderItems: result2!.map(def => new OrderItem(def)),
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

	useEffect(() => {
		// If selected tenant is 0, we know tenant ctx is not ready
		if (tenantCtx.selectedTenantId === 0) return;
		getSummary();
	}, [tenantCtx.selectedTenantId]);

	return (
		<HomeDashboardContext.Provider
			value={{
				data: homeDashboardState,
				isStateLoading: formState.state.isFormLoading,
				isError: formState.state.isError,
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
