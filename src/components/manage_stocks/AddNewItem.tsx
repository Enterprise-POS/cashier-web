import { useRef, useState } from 'react';
import Select from 'react-select';

import { Store } from '@/_classes/Store';
import { Tenant } from '@/_classes/Tenant';
import { TransferStockRequest } from '@/_interface/TransferStock';
import { convertTo } from '@/_lib/utils';
import { getActiveWarehouseItem } from '@/_lib/warehouse';
import { useFormState } from '@/components/hooks/useFormState';
import { useTenant } from '@/components/provider/TenantProvider';
import AsyncSelect from 'react-select/async';

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
	const timeoutRef = useRef<NodeJS.Timeout>(undefined);
	const [changedProduct, setChangedProduct] = useState<{ value: string; label: string } | null>(null);
	const currentSelectedStore: Store | undefined = storeList.find(s => s.id === currentSelectedStoreId);
	const selectedTenant: Tenant | undefined = tenantCtx.data.tenantList.find(
		t => t.id === tenantCtx.data.selectedTenantId
	);

	// 01 Get latest products
	// 02 If user start typing then fetch another
	const handleGetProducts = async (keyword: string): Promise<{ value: string; label: string }[]> => {
		if (selectedTenant === undefined) return [];

		try {
			const page = 1;
			const limit = 10;
			const { error, result } = await getActiveWarehouseItem(selectedTenant.id, limit, page, keyword);
			if (error === null) {
				return result!.itemDefs.map(def => ({ value: def.item_id!.toString(), label: def.item_name! }));
			} else {
				formState.setError({ message: error });
				return [];
			}
		} catch (e) {
			const error = e as Error;
			console.error(`[ERROR] ${error.message}`);
			formState.setError({ message: `Unexpected error: ${error.message}` });
			return [];
		}
	};

	type SelectItemType = { value: string; label: string }[];
	const loadProducts = (inputValue: string, callback: (options: SelectItemType) => void) => {
		/*
			When user not yet complete type then
			cancel previous request
		*/
		if (timeoutRef !== undefined) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(async () => callback(await handleGetProducts(inputValue)), 150);
	};

	const itemId = convertTo.number(changedProduct?.value ?? '');

	const formName = {
		item: 'item',
	};

	return (
		<>
			{/* Error Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					id="liveToast"
					className={`toast ${formState.state.isError ? 'show' : ''} colored-toast bg-danger-transparent`}
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
												Target Store <span className="text-danger ms-1">*</span>
											</label>
											<Select
												classNamePrefix="react-select"
												options={storeList.map(s => ({ label: s.name, value: s.id }))}
												placeholder="Choose"
												tabSelectsValue
												defaultValue={
													currentSelectedStore !== undefined && {
														label: currentSelectedStore.name,
														value: currentSelectedStore.id,
													}
												}
											/>
										</div>
									</div>
									<div className="col-lg-12">
										<div className="search-form mb-0">
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
									disabled={itemId === null}
									onClick={() => {
										if (itemId === null) return;
										onNewTransferItem(
											{
												itemId,
												quantity: 1,
												storeId: currentSelectedStoreId,
												tenantId: selectedTenant?.id ?? 0,
											},
											changedProduct!.label
										);
									}}
								>
									Confirm
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
