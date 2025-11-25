'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Delete, MoreVertical } from 'react-feather';

import { Store } from '@/_classes/Store';
import { StoreDef } from '@/_interface/StoreDef';
import { createStore, storeSetActivate } from '@/_lib/store';
import { all_routes as routes } from '@/components/core/data/all_routes';
import { useFormState } from '@/components/hooks/useFormState';
import SectionLoading from '@/components/partials/SectionLoading';
import { useStore } from '@/components/provider/StoreProvider';
import AddStoreModal from '@/components/store_list/AddStoreModal';
import ErrorToast from '@/components/toast/ErrorToast';
import SuccessToast from '@/components/toast/SuccessToast';

enum FilterByActivate {
	ACTIVE_ONLY = 'active_only',
	INACTIVE_ONLY = 'inactive_only',
	NO_FILTER = 'no_filter',
}

export default function StoreListComponent() {
	const searchParams = useSearchParams();
	const storeCtx = useStore();
	const formState = useFormState();
	const [currentTobeDeletedStore, setTobeDeletedStore] = useState<Store>();

	async function handleAddStore(newStore: StoreDef) {
		if (formState.state.isFormLoading) return;
		try {
			formState.setFormLoading(true);
			const { error } = await createStore(newStore);
			if (error !== null) {
				formState.setError({ message: error });
			} else {
				formState.setSuccess({ message: 'Product information edited successfully' });
				storeCtx.refetchGetStores(); // Restart the store list
			}
		} catch (e) {
			const error = e as Error;
			console.error(`[ERROR] ${error.message}`);
			formState.setError({ message: `Unexpected error: ${error.message}` });
		} finally {
			formState.setFormLoading(false);
		}
	}

	async function onSetStoreActivate(setInto: boolean, storeId: number, tenantId: number) {
		// We don't want optimistic here, we want change the value immediately
		if (formState.state.isFormLoading) return;
		try {
			formState.setFormLoading(true);
			const { error } = await storeSetActivate(setInto, storeId, tenantId);
			if (error !== null) {
				formState.setError({ message: error });
			} else {
				const newEditedStoreList = storeCtx.data.storeList.map(store => {
					if (store.id === storeId && store.tenantId === tenantId) {
						store.isActive = setInto;
						return store;
					} else {
						return store;
					}
				});
				storeCtx.setStoreList(newEditedStoreList);
				formState.setSuccess({ message: `Store set into ${setInto ? 'In Active' : 'Active'}` });
			}
		} catch (e) {
			const error = e as Error;
			console.error(`[ERROR] ${error.message}`);
			formState.setError({ message: `Unexpected error: ${error.message}` });
		} finally {
			formState.setFormLoading(false);
		}
	}

	const filterByActivateParam = searchParams.get('filter_by_activate') as FilterByActivate | null;
	const filteredStoreList = storeCtx.data.storeList.filter(store => {
		switch (filterByActivateParam) {
			case FilterByActivate.ACTIVE_ONLY:
				return store.isActive === true;
			case FilterByActivate.INACTIVE_ONLY:
				return store.isActive === false;
			case FilterByActivate.NO_FILTER:
			default:
				return true;
		}
	});

	if (storeCtx.isStateLoading) return <SectionLoading caption={`Loading / updating store list... 🕐`} />;

	return (
		<>
			<SuccessToast isSuccess={formState.state.isSuccess}>{formState.value.successMessage}</SuccessToast>
			<ErrorToast isError={formState.state.isError}>{formState.value.errorMessage}</ErrorToast>

			<div className="employee-grid-widget">
				<div className="row">
					{filteredStoreList.map(store => (
						<div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6" key={store.id.toString()}>
							<div className="card">
								<div className="card-body">
									<div className="d-flex align-items-start justify-content-between mb-2">
										<div className="form-check form-check-md">
											<input className="form-check-input" type="checkbox" />
										</div>
										<div>
											<Link
												href={routes.employeedetails}
												className="avatar avatar-xl avatar-rounded border p-1 rounded-circle"
											>
												<Image
													width={60}
													height={60}
													src="/assets/img/users/user-32.jpg"
													className="img-fluid h-auto w-auto"
													alt="img"
												/>
											</Link>
										</div>
										<div className="dropdown">
											<Link href="#" className="action-icon border-0" data-bs-toggle="dropdown" aria-expanded="false">
												<MoreVertical />
											</Link>
											<ul className="dropdown-menu dropdown-menu-end ">
												<li>
													<Link href="#" className="dropdown-item">
														<span className="me-2">Edit</span>
													</Link>
												</li>
												<li>
													<button
														className="dropdown-item confirm-text mb-0"
														data-bs-toggle="modal"
														data-bs-target="#delete-modal"
														onClick={() => setTobeDeletedStore(store)}
													>
														<span className="me-2">{store.isActive ? 'Delete' : 'Undo'}</span>
													</button>
												</li>
											</ul>
										</div>
									</div>
									<div className="text-center">
										<p className="text-primary mb-2">STORE ID : {store.id}</p>
									</div>
									<div className="text-center mb-3">
										<h6 className="mb-1">
											<Link href={routes.employeedetails}>{store.name}</Link>
										</h6>
										{/* <span className="badge bg-secondary-transparent fs-10 fw-medium">System Admin</span> */}
									</div>
									<div className="d-flex align-items-center justify-content-between bg-light rounded p-3">
										<div className="text-start">
											<h6 className="mb-1">Established</h6>
											<p>{store.createdAt.toLocaleDateString()}</p>
										</div>
										<div className="text-start">
											<h6 className="mb-1">Status</h6>
											{store.isActive ? (
												<p className="text-success">Active</p>
											) : (
												<p className="text-danger">In-Active</p>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<AddStoreModal
				onAddStore={handleAddStore}
				tenantId={storeCtx.getCurrentTenantId()}
				disabled={formState.state.isFormLoading}
			/>

			<div className="modal fade" id="delete-modal">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="page-wrapper-new p-0">
							<div className="p-5 px-3 text-center">
								<span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2">
									<Delete className="ti ti-trash fs-24 text-danger" />
								</span>
								<h4 className="fs-20 fw-bold mb-2 mt-1">
									{currentTobeDeletedStore?.isActive ? 'Delete' : 'Undo'}{' '}
									{currentTobeDeletedStore?.name ?? 'unselected'}
								</h4>
								{currentTobeDeletedStore !== undefined && currentTobeDeletedStore?.isActive ? (
									<p className="mb-0 fs-16">
										Are you sure you want to delete {currentTobeDeletedStore?.name ?? 'unselected'}? This action may
										take some time to remove all remaining data. Until the deletion is fully completed, the status will
										be Inactive, and you can undo the deletion. By pressing Confirm, you acknowledge and accept the
										consequences.
									</p>
								) : (
									<p className="mb-0 fs-16">
										Are you sure you want to undo deletion {currentTobeDeletedStore?.name ?? 'unselected'}?
									</p>
								)}
								<div className="modal-footer-btn mt-3 d-flex justify-content-center">
									<button
										type="button"
										className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
										data-bs-dismiss="modal"
									>
										Cancel
									</button>
									<button
										data-bs-dismiss="modal"
										className="btn btn-primary fs-13 fw-medium p-2 px-3"
										onClick={() => {
											if (currentTobeDeletedStore === undefined) return;
											onSetStoreActivate(
												!currentTobeDeletedStore.isActive,
												currentTobeDeletedStore.id,
												currentTobeDeletedStore.tenantId
											);
										}}
									>
										Confirm
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
