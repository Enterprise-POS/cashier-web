'use client';

import { Tenant } from '@/_classes/Tenant';
import { getTenantWithUser } from '@/_lib/action';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Constants } from '@/components/core/data/constant';
import { convertTo } from '@/_lib/utils';

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
	const isFetchingRef = useRef(false); // Track fetch status immediately

	function setCurrentTenant(id: number) {
		if (id === 0) {
			localStorage.removeItem(Constants.LocalStorageKey.currentSelectedTenant);
		} else {
			localStorage.setItem(Constants.LocalStorageKey.currentSelectedTenant, id.toString());
		}
		setTenantState(val => ({ ...val, selectedTenantId: id }));
	}

	async function refetchGetTenants() {
		if (isFetchingRef.current) return;
		isFetchingRef.current = true; // Set immediately
		setIsLoading(true);

		try {
			const { result: tenantDefs, error } = await getTenantWithUser();

			if (error !== null) {
				if (error.includes('[LOGIN]')) {
					setTenantState(val => ({ ...val, tenantList: [] }));
					return;
				} else {
					console.warn(error);
					setTenantState(val => ({ ...val, tenantList: [] }));
					return;
				}
			}

			const tenants = tenantDefs!.map(tenantDef => new Tenant(tenantDef));
			setTenantState(val => ({ ...val, tenantList: tenants }));

			// Get cached tenant
			const localTenantId: string | null = localStorage.getItem(Constants.LocalStorageKey.currentSelectedTenant);
			const cachedCurrentTenantId: number | null = convertTo.number(localTenantId);

			// Check if user cached is a valid tenant, otherwise don't select any tenant then reset cache
			if (cachedCurrentTenantId !== null) {
				const doesExistTenant: Tenant | undefined = tenants.find(tenant => tenant.id === cachedCurrentTenantId);
				if (doesExistTenant !== undefined) {
					setCurrentTenant(doesExistTenant.id);
				} else {
					setCurrentTenant(0);
				}
			}
		} finally {
			setIsLoading(false);
			isFetchingRef.current = false;
		}
	}

	// When this page first open then this effect will run to fetch immediately user tenant
	// Will not re fetch when the user logout and login again.
	// The refetch for this case handled by HeaderFloatingMenu.tsx,
	// will trigger refetchGetTenant when user cookie 'sub' change
	useEffect(() => {
		refetchGetTenants();
	}, []);

	return (
		<TenantContext.Provider value={{ data, isStateLoading, refetchGetTenants, setCurrentTenant }}>
			{children}
		</TenantContext.Provider>
	);
}

function useTenant(): TenantContextType {
	const context = useContext(TenantContext);
	if (context === undefined) throw new Error('useTenant must be used within a TenantProvider');

	return context;
}

export { TenantProvider, useTenant };
