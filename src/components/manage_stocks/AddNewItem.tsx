import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';

import { Store } from '@/_classes/Store';
import { TransferStockRequest } from '@/_interface/TransferStock';
import { closeBootstrapModal, openBootstrapModal } from '@/_lib/utils';
import { useFormState } from '@/components/hooks/useFormState';
import { SelectProductToAddNew } from '@/components/manage_stocks/SelectProductToAddNew';
import { useTenant } from '@/components/provider/TenantProvider';
import { PlusCircle, Trash2 } from 'react-feather';

/*
	User flow when click 'Add New'
	01. This current / AddNewItem modal will open
	02. By default selected store id already set
	03. User click 'Add Product'
	04. SelectProductToAddNew modal will open
	05. User checks one or more product rows (selections persist across pages)
	06. User clicks 'Add Selected' → all checked items added to queue, back to AddNewItem
	07. Repeat steps 03-06 to add more products
	08. Confirm All clicked → all queue items transferred simultaneously
*/

type QueueItem = {
	id: string;
	itemId: number;
	itemName: string;
	quantity: number;
	stocks: number;
};

export function AddNewItem({
	storeList,
	currentSelectedStoreId,
	loading,
	onNewTransferItems,
}: {
	storeList: Store[];
	currentSelectedStoreId: number;
	loading: boolean;
	onNewTransferItems: (items: Array<{ req: TransferStockRequest; itemName: string }>) => Promise<number[]>;
}) {
	const tenantCtx = useTenant();
	const formState = useFormState();
	const [selectedStoreId, setSelectedStoreId] = useState(currentSelectedStoreId);
	const [queue, setQueue] = useState<QueueItem[]>([]);
	const [isOpenProductPicker, setIsOpenProductPicker] = useState(false);
	const currentSelectedStore: Store | undefined = storeList.find(s => s.id === currentSelectedStoreId);
	const navigatingToPicker = useRef(false);
	const selectionMade = useRef(false);

	// Reset queue when modal is closed, but NOT when closing to navigate to the product picker
	useEffect(() => {
		const modal = document.getElementById('add-units');
		const reset = () => {
			if (navigatingToPicker.current) {
				navigatingToPicker.current = false;
				return;
			}
			setQueue([]);
		};
		modal?.addEventListener('hidden.bs.modal', reset);
		return () => modal?.removeEventListener('hidden.bs.modal', reset);
	}, []);

	// Reopen AddNewItem when product picker is dismissed without a selection (Cancel / X)
	useEffect(() => {
		const picker = document.getElementById('select-product-to-add-new');
		const handleHidden = () => {
			if (selectionMade.current) {
				selectionMade.current = false;
				return;
			}
			openBootstrapModal('#add-units');
		};
		picker?.addEventListener('hidden.bs.modal', handleHidden);
		return () => picker?.removeEventListener('hidden.bs.modal', handleHidden);
	}, []);

	const addToQueue = (itemId: number, itemName: string, stocks: number) => {
		setQueue(prev => {
			const existing = prev.find(item => item.itemId === itemId);
			if (existing) {
				return prev.map(item =>
					item.itemId === itemId
						? { ...item, quantity: Math.min(item.quantity + 1, item.stocks) }
						: item
				);
			}
			return [...prev, { id: crypto.randomUUID(), itemId, itemName, quantity: 1, stocks }];
		});
	};

	const updateQuantity = (id: string, value: string) => {
		setQueue(prev =>
			prev.map(item => {
				if (item.id !== id) return item;
				const qty = Math.min(Math.max(1, Number(value) || 1), item.stocks);
				return { ...item, quantity: qty };
			})
		);
	};

	const removeFromQueue = (id: string) => {
		setQueue(prev => prev.filter(item => item.id !== id));
	};

	const handleConfirmAll = async () => {
		if (tenantCtx.data.selectedTenantId === 0) {
			formState.setError({ message: 'You are not under any tenant mode. Please make sure the tenant is selected' });
			return;
		}
		if (selectedStoreId === 0) {
			formState.setError({ message: 'Please select target store first' });
			return;
		}
		if (queue.length === 0) return;

		const failedItemIds = await onNewTransferItems(
			queue.map(item => ({
				req: {
					itemId: item.itemId,
					quantity: item.quantity,
					storeId: selectedStoreId,
					tenantId: tenantCtx.data.selectedTenantId,
				},
				itemName: item.itemName,
			}))
		);

		if (failedItemIds.length > 0) {
			setQueue(prev => prev.filter(item => failedItemIds.includes(item.itemId)));
		}
	};

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

								<div>
									<label className="form-label">
										Products <span className="text-danger ms-1">*</span>
									</label>

									{queue.length === 0 ? (
										<p className="text-muted small mb-2">No products added yet. Click &quot;Add Product&quot; to begin.</p>
									) : (
										<div style={{ maxHeight: '240px', overflowY: 'auto' }} className="mb-2">
											<table className="table table-sm table-bordered align-middle mb-0">
												<thead className="table-light">
													<tr>
														<th>Product Name</th>
														<th style={{ width: '8rem' }}>Quantity</th>
														<th style={{ width: '3rem' }}></th>
													</tr>
												</thead>
												<tbody>
													{queue.map(item => (
														<tr key={item.id}>
															<td className="text-truncate" style={{ maxWidth: '180px' }}>{item.itemName}</td>
															<td>
																<input
																	type="number"
																	className="form-control form-control-sm"
																	value={item.quantity}
																	min={1}
																	max={item.stocks}
																	disabled={loading}
																	onChange={e => updateQuantity(item.id, e.target.value)}
																/>
																<small className="text-muted">Max: {item.stocks}</small>
															</td>
															<td className="text-center">
																<button
																	type="button"
																	className="btn btn-sm btn-outline-danger"
																	disabled={loading}
																	onClick={() => removeFromQueue(item.id)}
																	title="Remove"
																>
																	<Trash2 size={13} />
																</button>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									)}

									<button
										type="button"
										className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
										disabled={loading}
										data-bs-toggle="modal"
										data-bs-target="#select-product-to-add-new"
										onClick={() => {
											navigatingToPicker.current = true;
											setIsOpenProductPicker(true);
											closeBootstrapModal('#add-units');
										}}
									>
										<PlusCircle size={13} />
										Add Product
									</button>
								</div>
							</div>

							<div className="modal-footer">
								<button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
									Cancel
								</button>
								<button
									className="btn btn-primary"
									type="button"
									disabled={queue.length === 0 || loading}
									onClick={handleConfirmAll}
								>
									{loading ? 'Please wait...' : `Confirm All (${queue.length})`}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<SelectProductToAddNew
				tenantId={tenantCtx.data.selectedTenantId}
				isModalOpen={isOpenProductPicker}
				onSelected={(items) => {
					selectionMade.current = true;
					items.forEach(({ itemId, itemName, stocks }) => addToQueue(itemId, itemName, stocks));
					setIsOpenProductPicker(false);
					openBootstrapModal('#add-units');
				}}
			/>
		</>
	);
}
