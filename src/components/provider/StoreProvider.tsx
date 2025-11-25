'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { Store } from '@/_classes/Store';
import { getStores } from '@/_lib/store';
import { Constants } from '@/components/core/data/constant';
import { useTenant } from '@/components/provider/TenantProvider';

export type StoreProviderState = {
	selectedStoreId: number;
	storeList: Store[];
};

type StoreContextType = {
	data: StoreProviderState;
	isStateLoading: boolean;

	setCurrentStore: (id: number) => void;

	refetchGetStores: () => void; // internal use
	// setStoreState: (state: SetStateAction<StoreProviderState>) => void; // internal use

	getCurrentTenantId: () => number;

	setStoreList: (stores: Store[]) => void;
};

const initialState: StoreProviderState = {
	selectedStoreId: 0,
	storeList: [],
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function StoreProvider({ children }: { children: React.ReactNode }) {
	const { data: tenantCtx } = useTenant(); // Depend on TenantProvider
	const [data, setStoreState] = useState<StoreProviderState>(initialState);
	const [isStateLoading, setIsLoading] = useState(false);

	function setCurrentStore(id: number) {
		if (id === 0) {
			localStorage.removeItem(Constants.LocalStorageKey.currentSelectedStore);
		} else {
			localStorage.setItem(Constants.LocalStorageKey.currentSelectedStore, id.toString());
		}
		setStoreState(val => ({ ...val, selectedStoreId: id }));
	}

	async function refetchGetStores() {
		setIsLoading(true);

		// ATTENTION: for current state, we only allow user to have maximum store up to 10, so the limit is 10
		const { result, error } = await getStores(tenantCtx.selectedTenantId, 1, 10);
		if (error !== null) {
			console.log(error);
			if (error.includes('[LOGIN]')) {
				setStoreState(val => ({ ...val, storeList: [] }));
				setIsLoading(false);
				return;
			} else {
				console.warn(error);
				setStoreState(val => ({ ...val, storeList: [] }));
				setIsLoading(false);
				return;
			}
		}
		const stores = result!.storeDefs.map(def => new Store(def));
		setStoreState(val => ({ ...val, storeList: stores }));
		setIsLoading(false);
	}

	function getCurrentTenantId(): number {
		// To make this state less confusing, we don't give StoreProvider direct access to TenantProvider
		return tenantCtx.selectedTenantId;
	}

	// The function called at
	// - store_list -> component while handling onSetStoreActivate or onEditStore
	function setStoreList(stores: Store[]) {
		setStoreState(val => ({ ...val, storeList: stores }));
	}

	// When this page first open then this effect will run to fetch immediately user tenant
	// Will not re fetch when the user logout and login again.
	// The refetch for this case handled by HeaderFloatingMenu.tsx,
	// will trigger refetchGetTenant when user cookie 'sub' change
	useEffect(() => {
		if (tenantCtx.selectedTenantId === 0) return;

		// Get cached store
		const cachedCurrentStoreId: string | null = localStorage.getItem(Constants.LocalStorageKey.currentSelectedStore);
		const num = Number(cachedCurrentStoreId);
		const isCurrentCachedStoreIdNumber: boolean = isNaN(num);
		if (!isCurrentCachedStoreIdNumber) {
			setCurrentStore(num);
		}

		refetchGetStores();
	}, [tenantCtx.selectedTenantId]); // When the selected tenant change then the store will definitely different

	return (
		<StoreContext.Provider
			value={{ data, isStateLoading, refetchGetStores, setCurrentStore, getCurrentTenantId, setStoreList }}
		>
			{children}
		</StoreContext.Provider>
	);
}

function useStore(): StoreContextType {
	const context = useContext(StoreContext);
	if (context === undefined) throw new Error('[DEV] useStore must be used within a StoreProvider');

	return context;
}

export { StoreProvider, useStore };
