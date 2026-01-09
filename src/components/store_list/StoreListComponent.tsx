import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search } from 'react-feather';

import { Store as _Store } from '@/_classes/Store';
import { Tenant } from '@/_classes/Tenant';
import { createNewStore, setStoreActivate } from '@/_lib/store';
import { closeBootstrapModal } from '@/_lib/utils';
import { useFormState } from '@/components/hooks/useFormState';
import SectionLoading from '@/components/partials/SectionLoading';
import { useStore } from '@/components/provider/StoreProvider';
import { useTenant } from '@/components/provider/TenantProvider';
import AddNewStore from '@/components/store_list/AddNewStore';
import SetActiveModal from '@/components/store_list/DeleteStoreModal';
import Store from '@/components/store_list/Store';

enum ActivateFilter {
	ACTIVE = 'Active',
	INACTIVE = 'In-Active',
	UNSELECTED = 'Unselected', // show both
}
export default function StoreListComponent() {
	const [isMounted, setIsMounted] = useState(false);
	const tenantCtx = useTenant();
	const storeCtx = useStore();
	const formState = useFormState();
	const [currentTobeDeletedStore, setCurrentTobeDeletedStore] = useState<_Store>();
	const [currentFilter, setCurrentFilter] = useState(ActivateFilter.ACTIVE);

	const selectedTenant: Tenant | undefined = tenantCtx.data.tenantList.find(
		tenant => tenant.id === tenantCtx.data.selectedTenantId
	);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (selectedTenant === undefined) return;
		getData();
	}, [selectedTenant]);

	async function getData() {}

	async function handleCreateNewStore(storeName: string) {
		if (formState.state.isFormLoading) return;
		formState.setFormLoading(true);

		const { error, result } = await createNewStore(storeName, selectedTenant?.id ?? 0);
		if (error !== null) {
			formState.setError({ message: error });
		} else {
			storeCtx.refetchGetStores();
			formState.setSuccess({ message: `Successfully created ${result!.name}` });
			closeBootstrapModal('#add-units [data-bs-dismiss="modal"]');
		}
		formState.setFormLoading(false);
	}

	async function setActivate(store: _Store) {
		if (formState.state.isFormLoading || !selectedTenant) return;
		formState.setFormLoading(true);

		if (store.isActive) {
			const { error } = await setStoreActivate(selectedTenant.id, store.id, false);
			if (error !== null) {
				formState.setError({ message: error });
			} else {
				storeCtx.refetchGetStores();
				formState.setSuccess({ message: `${store!.name} is inactivated` });
			}
		} else {
			const { error } = await setStoreActivate(selectedTenant.id, store.id, true);
			if (error !== null) {
				formState.setError({ message: error });
			} else {
				storeCtx.refetchGetStores();
				formState.setSuccess({ message: `${store!.name} is active` });
			}
		}

		closeBootstrapModal('#delete-modal [data-bs-dismiss="modal"]');
		formState.setFormLoading(false);
	}

	if (!isMounted || tenantCtx.isStateLoading || storeCtx.isStateLoading)
		return <SectionLoading caption={`Loading ${selectedTenant?.name ?? ''} stores...`} />;

	const filteredStores = storeCtx.data.storeList.filter(store => {
		switch (currentFilter) {
			case ActivateFilter.ACTIVE:
				return store.isActive === true;

			case ActivateFilter.INACTIVE:
				return store.isActive === false;

			case ActivateFilter.UNSELECTED:
				return true; // show both

			default:
				return true;
		}
	});

	return (
		<>
			{/* Success Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					id="liveToast"
					className={`toast ${formState.state.isSuccess ? 'show' : ''} colored-toast`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-success text-fixed-white">
						<strong className="me-auto">Success !</strong>
						<button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
					</div>
					<div className="toast-body">{formState.value.successMessage}</div>
				</div>
			</div>

			{/* Error Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					id="liveToast"
					className={`toast ${formState.state.isError ? 'show' : ''} colored-toast`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-danger text-fixed-white">
						<strong className="me-auto">Warning</strong>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="toast"
							aria-label="Close"
							onClick={() => formState.setState({ error: false })}
						></button>
					</div>
					<div className="toast-body">{formState.value.errorMessage}</div>
				</div>
			</div>

			<div className="card">
				<div className="card-body">
					<div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
						<div className="search-set mb-0">
							<div className="search-input">
								<Link href="#" className="btn btn-searchset">
									<Search data-feather="search" className="feather-search" />
								</Link>
								<input type="search" className="form-control" placeholder="Search" />
							</div>
						</div>
						<div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
							<div className="dropdown me-2">
								<Link
									href="#"
									className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
									data-bs-toggle="dropdown"
								>
									{currentFilter}
								</Link>
								<ul className="dropdown-menu  dropdown-menu-end p-3">
									<li>
										<button
											className="dropdown-item rounded-1"
											onClick={() => setCurrentFilter(ActivateFilter.UNSELECTED)}
										>
											Unselect
										</button>
									</li>
									<li>
										<button className="dropdown-item rounded-1" onClick={() => setCurrentFilter(ActivateFilter.ACTIVE)}>
											Active
										</button>
									</li>
									<li>
										<button
											className="dropdown-item rounded-1"
											onClick={() => setCurrentFilter(ActivateFilter.INACTIVE)}
										>
											In-Active
										</button>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="employee-grid-widget">
				<div className="row">
					{filteredStores.map(store => {
						return <Store key={store.id} store={store} onDeleteButton={s => setCurrentTobeDeletedStore(s)} />;
					})}
					{filteredStores.length === 0 && (
						<p className="text-center pt-5">
							{currentFilter === ActivateFilter.ACTIVE && 'No store found'}. Create by click top right button (Create
							new store)
						</p>
					)}
				</div>

				<AddNewStore isLoading={formState.state.isFormLoading} onClick={storeName => handleCreateNewStore(storeName)} />
				<SetActiveModal currentSelectedStore={currentTobeDeletedStore} onAction={s => setActivate(s)} />
			</div>
		</>
	);
}
