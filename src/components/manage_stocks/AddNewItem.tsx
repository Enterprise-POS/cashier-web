import { useRef, useState } from 'react';
import Select from 'react-select';

import { Store } from '@/_classes/Store';
import { Tenant } from '@/_classes/Tenant';
import { TransferStockRequest } from '@/_interface/TransferStock';
import { closeBootstrapModal, convertTo, openBootstrapModal } from '@/_lib/utils';
import { useFormState } from '@/components/hooks/useFormState';
import { SelectProductToAddNew } from '@/components/manage_stocks/SelectProductToAddNew';
import { useTenant } from '@/components/provider/TenantProvider';

/*
	User flow when click 'Add New'
	01. This current / AddNewItem modal will open
	02. By default selected store id already set
	03. User click 'select product'
	04. SelectProductToAddNew modal will open
	05. When user clicked what product to add then
	06. Back to AddNewItem modal
	07. Confirm clicked request to server
*/
export function AddNewItem({
	storeList,
	currentSelectedStoreId,
	loading,
	onNewTransferItem,
}: {
	storeList: Store[];
	currentSelectedStoreId: number;
	loading: boolean;
	onNewTransferItem: (transferStockRequest: TransferStockRequest, itemName: string) => void;
}) {
	const tenantCtx = useTenant();
	const formState = useFormState();
	const [selectedStoreId, setSelectedStoreId] = useState(currentSelectedStoreId);
	const [changedProduct, setChangedProduct] = useState<{ value: string; label: string } | null>(null);
	const [isOpenAddNewItem, setIsOpenAddItem] = useState(false);
	const currentSelectedStore: Store | undefined = storeList.find(s => s.id === currentSelectedStoreId);

	const handleOnNewTransferItem = () => {
		if (tenantCtx.data.selectedTenantId === 0) {
			formState.setError({ message: 'You are not under any tenant mode. Please make sure the tenant is selected' });
			return;
		}
		if (selectedStoreId === 0) {
			formState.setError({ message: 'Please select target store first' });
			return;
		}
		if (itemId === null) return;

		// Callback from parameter. Execute when the confirm button clicked
		onNewTransferItem(
			{
				itemId,
				quantity: 1,
				storeId: selectedStoreId,
				tenantId: tenantCtx.data.selectedTenantId,
			},
			changedProduct!.label,
		);
	};

	const itemId = convertTo.number(changedProduct?.value ?? '');

	return (
		<>
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

			<div className="modal fade" id="add-units">
				<div className="modal-dialog modal-dialog-centered stock-adjust-modal">
					<div className="modal-content">
						<div className="modal-header">
							<div className="page-title">
								<h4>Add New Item</h4>
							</div>
							<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<form>
							<div className="modal-body">
								<div className="row">
									<div className="col-lg-12">
										<div className="mb-3">
											<label className="form-label">
												Select Store <span className="text-danger ms-1">*</span>
											</label>
											<Select
												classNamePrefix="react-select"
												options={storeList.map(s => ({ label: s.name, value: s.id }))}
												placeholder="Choose"
												tabSelectsValue
												defaultValue={
													currentSelectedStore !== undefined
														? { label: currentSelectedStore.name, value: currentSelectedStore.id }
														: undefined
												}
												onChange={e => setSelectedStoreId(e?.value ?? currentSelectedStoreId)}
											/>
										</div>
									</div>
									<div className="col-lg-12">
										{/* <div className="search-form mb-0">
											<label className="form-label">
												Product <span className="text-danger ms-1">*</span>
											</label>
											<AsyncSelect
												className="react-select"
												loadOptions={loadProducts}
												placeholder="Select"
												name={formName.item}
												components={{ DropdownIndicator: null }}
												onChange={e => setChangedProduct({ label: e?.label ?? '', value: e?.value ?? '' })}
											/>
											<p>
												Product names are case-sensitive. Before adding a new item to the current store, please make
												sure at least 1 unit is available in the warehouse.
											</p>
										</div> */}

										<label className="form-label">
											Select product to add new<span className="text-danger ms-1">*</span>
										</label>
										<div className="page-btn">
											<button
												className="btn border text-secondary w-100"
												type="button"
												data-bs-toggle="modal"
												data-bs-target="#select-product-to-add-new"
												onClick={() => {
													// Triggers the fetch / fetch the product when select product modal is show
													setIsOpenAddItem(true);

													// Close add unit for a moment, later will return
													// AddNewItem -> SelectProductToAddNew -> AddNewItem
													closeBootstrapModal('#add-units');
												}}
											>
												{changedProduct === null ? 'select product' : changedProduct.label}
											</button>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
									Cancel
								</button>
								<button
									className="btn btn-primary"
									type="button"
									disabled={itemId === null || loading}
									onClick={() => handleOnNewTransferItem()}
								>
									{loading ? 'Please wait...' : 'Confirm'}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<SelectProductToAddNew
				tenantId={tenantCtx.data.selectedTenantId}
				isModalOpen={isOpenAddNewItem}
				onSelected={(itemId, itemName) => {
					setChangedProduct({ value: itemId.toString(), label: itemName });
					setIsOpenAddItem(false);
					openBootstrapModal('#add-units');
				}}
			/>
		</>
	);
}
