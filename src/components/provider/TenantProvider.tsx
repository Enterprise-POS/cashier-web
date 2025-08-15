'use client';

import { Tenant } from '@/_classes/Tenant';
import { getTenantWithUser } from '@/_lib/action';
import { createContext, useContext, useEffect, useState } from 'react';
import { Constants } from '@/components/core/data/constant';

export type TenantProviderState = {
	selectedTenantId: number;
	tenantList: Tenant[];
};

type TenantContextType = {
	data: TenantProviderState;
	isStateLoading: boolean;

	setCurrentTenant: (id: number) => void;

	refetchGetTenants: () => void; // internal use
	// setTenantState: (state: SetStateAction<TenantProviderState>) => void; // internal use
};

const initialState: TenantProviderState = {
	selectedTenantId: 0,
	tenantList: [],
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

function TenantProvider({ children }: { children: React.ReactNode }) {
	const [data, setTenantState] = useState<TenantProviderState>(initialState);
	const [isStateLoading, setIsLoading] = useState(false);

	function setCurrentTenant(id: number) {
		if (id === 0) {
			localStorage.removeItem(Constants.LocalStorageKey.currentSelectedTenant);
		} else {
			localStorage.setItem(Constants.LocalStorageKey.currentSelectedTenant, id.toString());
		}
		setTenantState(val => ({ ...val, selectedTenantId: id }));
	}

	async function refetchGetTenants() {
		setIsLoading(true);

		const { result: tenantDefs, error } = await getTenantWithUser();
		if (error !== null) {
			if (error.includes('[LOGIN]')) return;
			else {
				console.warn(error);
				return;
			}
		}

		const tenants = tenantDefs!.map(tenantDef => new Tenant(tenantDef));
		setTenantState(val => ({ ...val, tenantList: tenants }));

		setIsLoading(false);
	}

	// When this page first open then this effect will run to fetch immediately user tenant
	useEffect(() => {
		setIsLoading(true);

		// Get cached tenant
		const cachedCurrentTenantId: string | null = localStorage.getItem(Constants.LocalStorageKey.currentSelectedTenant);
		const num = Number(cachedCurrentTenantId);
		const cachedCurrentTenant: number = isNaN(num) ? 0 : num;
		if (cachedCurrentTenant !== 0) {
			setCurrentTenant(Number(cachedCurrentTenant));
		}

		// if (cachedCurrentTenant === null) return;

		async function doAction() {
			// Here we don't need the getAuth, already at server
			const { result: tenantDefs, error } = await getTenantWithUser();
			if (error !== null) {
				if (error.includes('[LOGIN]')) return;
				else {
					console.warn(error);
				}
			}

			const tenants = tenantDefs!.map(tenantDef => new Tenant(tenantDef));
			setTenantState(val => ({ ...val, tenantList: tenants }));

			setIsLoading(false);
		}
		doAction();
	}, []);

	return (
		<TenantContext.Provider value={{ data, isStateLoading, refetchGetTenants, setCurrentTenant }}>
			{children}
		</TenantContext.Provider>
	);
}

function useTenant(): TenantContextType {
	const context = useContext(TenantContext);
	if (context === undefined) {
		throw new Error('useTenant must be used within a TenantProvider');
	}

	return context;
}

export { TenantProvider, useTenant };
