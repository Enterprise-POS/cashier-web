import { Tooltip } from 'antd';
import { FormEventHandler, useEffect, useState } from 'react';
import { AlertCircle } from 'react-feather';

import { Store } from '@/_classes/Store';
import { StoreStockV2 } from '@/_classes/StoreStock';
import { Tenant } from '@/_classes/Tenant';

export default function EditAdjustment({
	tobeEditStoreStock,
	handleForm,
	selectedStore,
	selectedTenant,
}: {
	tobeEditStoreStock?: StoreStockV2;
	handleForm: FormEventHandler<HTMLFormElement>;
	selectedStore?: Store;
	selectedTenant?: Tenant;
}) {
	const [price, setPrice] = useState(tobeEditStoreStock?.price ?? 0);

	// Update price when tobeEditStoreStock changes
	useEffect(() => {
		if (tobeEditStoreStock) {
			setPrice(tobeEditStoreStock.price);
		}
	}, [tobeEditStoreStock]);

	const editFormName = {
		id: 'id', // store stock id
		price: 'price',
		storeId: 'storeId',
		itemId: 'itemId',
		tenantId: 'tenantId',
	};

	return (
		<div className="modal fade" id="edit-units">
			<div className="modal-dialog modal-dialog-centered stock-adjust-modal">
				<div className="modal-content">
					<div className="modal-header">
						<div className="page-title">
							<h4>
								Edit {tobeEditStoreStock && tobeEditStoreStock.itemName} info
								<Tooltip title="Editing current product only affect to current selected store. Make sure check store is correctly selected">
									<AlertCircle className="ms-2" size={16} color="red" />
								</Tooltip>
							</h4>
						</div>
						<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button>
					</div>
					{tobeEditStoreStock && (
						<form onSubmit={handleForm}>
							<input type="hidden" name={editFormName.storeId} value={selectedStore?.id ?? 0} />
							<input type="hidden" name={editFormName.itemId} value={tobeEditStoreStock.itemId} />
							<input type="hidden" name={editFormName.tenantId} value={selectedTenant?.id ?? 0} />
							<div className="modal-body">
								<div className="row">
									<div className="col-lg-6">
										<div className="mb-3">
											<label className="form-label">Product ID</label>
											<input
												type="text"
												name={editFormName.id}
												className="form-control"
												readOnly
												value={tobeEditStoreStock.id}
											/>
										</div>
									</div>
									<div className="col-lg-6">
										<div className="mb-3">
											<label className="form-label">
												Stock Type<span className="text-danger ms-1">*</span>
											</label>
											<Tooltip title="Editing store product stock type is not allowed here. You can edit product stock type by editing warehouse product.">
												<input type="text" className="form-control" disabled value={tobeEditStoreStock.stockType} />
											</Tooltip>
										</div>
									</div>
									<div className="col-lg-6">
										<div className="mb-3">
											<label className="form-label">
												Price<span className="text-danger ms-1">*</span>
											</label>
											<input
												type="text"
												className="form-control"
												name={editFormName.price}
												value={price}
												onChange={e => setPrice(Number(e.target.value))}
											/>
										</div>
									</div>
									<div className="col-lg-12">
										<div className="mb-3 summer-description-box">
											<label className="form-label">
												Notes<span className="text-danger ms-1">*</span>
											</label>
											<textarea className="form-control" disabled defaultValue={'Currently under development 💻⌛'} />
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
									Cancel
								</button>
								<button className="btn btn-primary" type="submit">
									Save Changes
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
