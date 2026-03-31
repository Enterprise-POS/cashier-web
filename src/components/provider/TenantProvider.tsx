'use client';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { Tenant } from '@/_classes/Tenant';
import { getTenantWithUser } from '@/_lib/action';
import { convertTo } from '@/_lib/utils';
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
	getToken: () => string;
};

const initialState: TenantProviderState = {
	selectedTenantId: 0,
	tenantList: [],
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const EXCLUDED_ROUTES = ['/server_error'];

function TenantProvider({ children, token }: { children: React.ReactNode; token: string }) {
	const [data, setTenantState] = useState<TenantProviderState>(initialState);
	const [isStateLoading, setIsLoading] = useState(false);
	const isFetchingRef = useRef(false); // Track fetch status immediately
	const pathname = usePathname();
	const router = useRouter();

	function setCurrentTenant(id: number) {
		if (id === 0) {
			localStorage.removeItem(Constants.LocalStorageKey.currentSelectedTenant);
		} else {
			localStorage.setItem(Constants.LocalStorageKey.currentSelectedTenant, id.toString());
		}
		setTenantState(val => ({ ...val, selectedTenantId: id }));
	}

	async function refetchGetTenants() {
		// WIll prevent infinite refetch tenant
		if (EXCLUDED_ROUTES.includes(pathname)) return;

		if (isFetchingRef.current) return;
		isFetchingRef.current = true; // Set immediately
		setIsLoading(true);

		try {
			const { result: tenantDefs, error } = await getTenantWithUser();

			if (error !== null) {
				if (error.includes('[LOGIN]')) {
					setTenantState(val => ({ ...val, tenantList: [] }));
					return; // We don't want the page keep executing code even the page is change
				} else if (error.includes('[SERVER ERROR]')) {
					sessionStorage.setItem('lastError', error);
					sessionStorage.setItem('lastErrorTime', Date.now().toString());
					router.push('/500');
					return; // Navigating so return is required here
				} else {
					// Normal error, should show what cause error to user
					setTenantState(val => ({ ...val, tenantList: [] }));
				}
			} else {
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
			}
		} finally {
			setIsLoading(false);
			isFetchingRef.current = false;
		}
	}

	function getToken() {
		return token;
	}

	// When this page first open then this effect will run to fetch immediately user tenant
	// Will not re fetch when the user logout and login again.
	// The refetch for this case handled by HeaderFloatingMenu.tsx,
	// will trigger refetchGetTenant when user cookie 'sub' change
	useEffect(() => {
		refetchGetTenants();
	}, []);

	return (
		<TenantContext.Provider value={{ data, isStateLoading, refetchGetTenants, setCurrentTenant, getToken }}>
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
