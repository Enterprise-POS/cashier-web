'use client';
import { useEffect } from 'react';
import Link from 'next/link';

import { Store } from '@/_classes/Store';
import { useStore } from '@/components/provider/StoreProvider';
import { selectIsDirty, useEditStoreInfoStore } from '@/components/store/editStoreInfoStore';
import { useFormState } from '@/components/hooks/useFormState';

export default function EditStoreInfoComponent() {
	const storeCtx = useStore();
	const formState = useFormState();

	// Value / state
	const storeName = useEditStoreInfoStore(s => s.storeName);
	const address = useEditStoreInfoStore(s => s.address);
	const phoneNumber = useEditStoreInfoStore(s => s.phoneNumber);
	const isDirty = useEditStoreInfoStore(selectIsDirty);

	// Actions
	const initializeValue = useEditStoreInfoStore(s => s.initializeValue);
	const onChangeInput = useEditStoreInfoStore(s => s.onChangeInput);
	const onClickSaveChange = useEditStoreInfoStore(s => s.onClickSaveChange);
	const reset = useEditStoreInfoStore(s => s.reset);

	const selectedStore: Store | undefined = storeCtx.data.storeList.find(
		store => store.id === storeCtx.data.selectedStoreId,
	);

	useEffect(() => {
		if (selectedStore !== undefined) {
			initializeValue({
				address: selectedStore.address,
				phoneNumber: selectedStore.phoneNumber,
				storeName: selectedStore.name,
			});
		} else {
			initializeValue({
				address: '',
				phoneNumber: '',
				storeName: '',
			});
		}
	}, [selectedStore]);

	const isLoading = storeCtx.isStateLoading || formState.state.isFormLoading;
	const { isError, isSuccess } = formState.state;
	const { successMessage, errorMessage } = formState.value;

	return (
		<>
			{/* Success Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					className={`toast ${isSuccess ? 'show' : ''} colored-toast`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-success text-fixed-white">
						<strong className="me-auto">Success!</strong>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={() => formState.setState({ success: false })}
						/>
					</div>
					<div className="toast-body">{successMessage}</div>
				</div>
			</div>

			{/* Error Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					className={`toast ${isError ? 'show' : ''} colored-toast`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-danger text-fixed-white">
						<strong className="me-auto">Warning</strong>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={() => formState.setState({ error: false })}
						/>
					</div>
					<div className="toast-body">{errorMessage}</div>
				</div>
			</div>

			<div className="card flex-fill">
				<div className="card-header d-flex">
					<h4 className="fs-18 fw-bold align-self-center">{selectedStore?.name} Profile</h4>
					<div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3 ms-auto">
						<div className="dropdown">
							<button
								className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
								data-bs-toggle="dropdown"
							>
								{selectedStore?.name ?? 'Select Store'}
							</button>
							<ul className="dropdown-menu dropdown-menu-end p-3">
								{storeCtx.data.storeList.map(store => (
									<li key={store.id} onClick={() => storeCtx.setCurrentStore(store.id)}>
										<Link href="#" className="dropdown-item rounded-1">
											{store.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
				<div className="card-body">
					<form>
						<div className="card-title-head">
							<h6 className="fs-16 fw-bold mb-3">
								<span className="fs-16 me-2">
									<i className="ti ti-home fs-16 me-2" />
								</span>
								Basic Information
							</h6>
						</div>
						<div className="row mb-3">
							<div className="col-md-4">
								<div className="mb-3">
									<label className="form-label">
										Store Name <span className="text-danger">*</span>
									</label>
									<input
										type="text"
										className="form-control"
										value={storeName}
										disabled={isLoading || selectedStore === undefined}
										onChange={e => onChangeInput('storeName', e.target.value)}
									/>
								</div>
							</div>
							<div className="col-md-4">
								<div className="mb-3">
									<label className="form-label">
										Phone Number <span className="text-danger">*</span>
									</label>
									<input
										type="text"
										className="form-control"
										value={phoneNumber}
										disabled={isLoading || selectedStore === undefined}
										onChange={e => onChangeInput('phoneNumber', e.target.value)}
									/>
								</div>
							</div>
						</div>
						<div className="card-title-head">
							<h6 className="fs-16 fw-bold mb-3">
								<span className="fs-16 me-2">
									<i className="ti ti-map-pin" />
								</span>
								Address Information
							</h6>
						</div>
						<div className="row">
							<div className="col-md-12">
								<div className="mb-3">
									<label className="form-label">
										Address <span className="text-danger">*</span>
									</label>
									<input
										type="text"
										className="form-control"
										value={address}
										disabled={isLoading || selectedStore === undefined}
										onChange={e => onChangeInput('address', e.target.value)}
									/>
								</div>
							</div>
						</div>
						<div className="text-end settings-bottom-btn mt-0">
							<button type="button" className="btn btn-secondary me-2" disabled={isLoading} onClick={() => reset()}>
								Cancel
							</button>
							<button
								type="button"
								className={`btn ${isLoading || !isDirty ? 'btn-primary-light' : 'btn-primary'}`}
								disabled={isLoading || !isDirty || selectedStore === undefined}
								onClick={() =>
									onClickSaveChange(storeCtx.getCurrentTenantId(), selectedStore?.id ?? 0, formState, storeCtx)
								}
							>
								{isLoading ? 'Please wait...' : 'Save Changes'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
