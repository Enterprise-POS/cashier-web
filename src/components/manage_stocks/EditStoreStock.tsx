import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MinusCircle, PlusCircle, Trash2 } from 'react-feather';

import { StoreStockV2 } from '@/_classes/StoreStock';
import { TransferStockRequest } from '@/_interface/TransferStock';

export function EditStoreStock({
	storeId,
	tenantId,
	tobeEditStoreStock,
	onConfirmEdit,
}: {
	storeId: number;
	tenantId: number;
	tobeEditStoreStock?: StoreStockV2;
	onConfirmEdit: (v: TransferStockRequest) => void;
}) {
	const [quantity, setQuantity] = useState<number>(0);
	useEffect(() => {
		setQuantity(0);
	}, [tobeEditStoreStock]);

	return (
		<>
			{/* Edit Stock */}
			<div className="modal fade" id="edit-units">
				<div className="modal-dialog modal-dialog-centered stock-adjust-modal">
					<div className="modal-content">
						<div className="modal-header">
							<div className="page-title">
								<h4>Edit Stock</h4>
							</div>
							<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<form>
							<div className="modal-body">
								<div className="row mb-2">
									<p>
										Any action, such as adding to or reducing the stock, will affect the current item (
										{tobeEditStoreStock?.itemName ?? 'unselected'}) in the warehouse.&nbsp;
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
															<th>Qty</th>
															<th className="no-sort" />
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
															<td>{tobeEditStoreStock?.id.toString() ?? '0'}</td>
															<td>{tobeEditStoreStock?.price ?? 0}</td>
															<td>
																<div className="product-quantity bg-gray-transparent border-0">
																	<span className="quantity-btn" onClick={() => setQuantity(quantity - 1)}>
																		<MinusCircle />
																	</span>
																	{tobeEditStoreStock !== undefined && (
																		<>
																			<input
																				type="text"
																				className="quntity-input bg-transparent"
																				value={tobeEditStoreStock.stocks + quantity}
																				onChange={e => {
																					e.preventDefault();
																					const value = Number(e.target.value);
																					if (isNaN(value)) return;
																					setQuantity(value);
																				}}
																			/>
																		</>
																	)}
																	<span className="quantity-btn" onClick={() => setQuantity(quantity + 1)}>
																		+
																		<PlusCircle className="plus-circle" />
																	</span>
																</div>
															</td>
															<td>
																<div className="d-flex align-items-center justify-content-between edit-delete-action">
																	<Link className="d-flex align-items-center border rounded p-2" href="#">
																		<Trash2 />
																	</Link>
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
								<Link
									href="#"
									className="btn btn-primary"
									data-bs-dismiss="modal"
									onClick={() => {
										if (tobeEditStoreStock === undefined) return;
										onConfirmEdit({
											quantity,
											storeId: storeId,
											tenantId: tenantId,
											itemId: tobeEditStoreStock.itemId,
										});
									}}
								>
									Confirm
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
			{/* /Edit Stock */}
		</>
	);
}
