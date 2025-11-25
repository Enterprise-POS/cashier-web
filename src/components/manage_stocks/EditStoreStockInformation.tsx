import { StoreStockV2 } from '@/_classes/StoreStock';
import { StoreStockDef } from '@/_interface/StoreStockDef';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function EditStoreStockInformation({
	storeId,
	tenantId,
	tobeEditStoreStock,
	onConfirmEdit,
}: {
	storeId: number;
	tenantId: number;
	tobeEditStoreStock?: StoreStockV2;
	onConfirmEdit: (v: StoreStockDef) => void;
}) {
	// Anything manage by state here, mean user allowed to edit
	const [tobeEditPrice, setTobeEditPrice] = useState(tobeEditStoreStock?.price ?? 0);
	useEffect(() => {
		if (tobeEditStoreStock !== undefined) {
			setTobeEditPrice(tobeEditStoreStock.price);
		}
	}, [tobeEditStoreStock]);

	return (
		<>
			{/* EditItem */}
			<div className="modal fade" id="edit-info">
				<div className="modal-dialog modal-dialog-centered stock-adjust-modal">
					<div className="modal-content">
						<div className="modal-header">
							<div className="page-title">
								<h4>Edit Item</h4>
							</div>
							<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<form>
							<div className="modal-body">
								<div className="row mb-2">
									<p>
										Any action, such as editing the current product information, will affect the entire system and may
										require some devices to restart the application.&nbsp;
										<span className="text-primary">Please proceed carefully.</span>
									</p>
								</div>
								<div className="row">
									<div className="col-lg-12">
										<div className="modal-body-table">
											<div className="table-responsive">
												<table className="table  datanew">
													<thead>
														<tr>
															<th>Product</th>
															<th>ID</th>
															<th>Price</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<td>
																<div className="d-flex align-items-center">
																	<Link href="#" className="avatar avatar-md">
																		<Image
																			src="/assets/img/products/stock-img-02.png"
																			alt="product"
																			width={60}
																			height={60}
																		/>
																	</Link>
																	<Link href="#" className="ms-2">
																		{tobeEditStoreStock?.itemName ?? 'unselected'}
																	</Link>
																</div>
															</td>
															<td title="This is read only property">{tobeEditStoreStock?.id.toString() ?? '0'}</td>
															<td>
																<div className="product-quantity bg-gray-transparent border-0">
																	<input
																		type="text"
																		className="quntity-input bg-transparent w-50"
																		value={tobeEditPrice.toString() ?? '0'}
																		onChange={e => {
																			e.preventDefault();
																			const value = Number(e.target.value);
																			if (isNaN(value)) return;
																			setTobeEditPrice(value);
																		}}
																	/>
																</div>
															</td>
														</tr>
													</tbody>
												</table>
											</div>
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
									data-bs-dismiss="modal"
									onClick={e => {
										e.preventDefault();
										if (tobeEditStoreStock === undefined) return;
										onConfirmEdit({
											// Ignored value
											stocks: 0,
											created_at: tobeEditStoreStock.createdAt.toISOString(),

											// Required value
											id: tobeEditStoreStock.id,
											item_id: tobeEditStoreStock.itemId,
											store_id: storeId,
											tenant_id: tenantId,

											// What user could request edit
											price: tobeEditPrice,
										});
									}}
								>
									Confirm
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			{/* /EditItem */}
		</>
	);
}
