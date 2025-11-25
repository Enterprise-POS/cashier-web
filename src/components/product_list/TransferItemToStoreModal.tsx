import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { MinusCircle, PlusCircle } from 'react-feather';
import Select from 'react-select';

import { Item } from '@/_classes/Item';
import { useStore } from '@/components/provider/StoreProvider';

export default function TransferItemToStoreModal({
	tenantId,
	currentSelectedItem,
	onConfirmTransferStock,
}: {
	tenantId: number;
	currentSelectedItem: Item | undefined;
	onConfirmTransferStock: (form: FormEvent<HTMLFormElement>) => void;
}) {
	const storeCtx = useStore();
	const [currentQuantity, setCurrentQuantity] = useState(0);
	useEffect(() => {
		if (currentSelectedItem !== undefined) {
			setCurrentQuantity(0);
		}
	}, [currentSelectedItem]);

	return (
		<div className="modal fade" id="edit-transfer">
			<div className="modal-dialog modal-dialog-centered stock-adjust-modal">
				<div className="modal-content">
					<div className="modal-header">
						<div className="page-title">
							<h4>Transfer Item Stock</h4>
						</div>
						<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button>
					</div>
					<form onSubmit={e => onConfirmTransferStock(e)}>
						<div className="modal-body">
							<div className="row mb-2">
								<p>
									Transferring current product stock to store will affect to target store history.&nbsp;
									<span className="text-primary">Please proceed carefully.</span>
								</p>
							</div>
							<div className="row">
								<Select
									name="storeId"
									className="mb-2"
									classNamePrefix="react-select"
									options={[
										{ label: 'Select Target Store', value: '0' },
										...storeCtx.data.storeList.map(s => ({ label: s.name, value: s.id })),
									]}
									placeholder="Choose"
									tabSelectsValue
								/>
								<div className="col-lg-12">
									<div className="modal-body-table">
										<div className="table-responsive">
											<table className="table  datanew">
												<thead>
													<tr>
														<th>Product</th>
														<th>ID</th>
														<th>Before Transfer</th>
														<th className={`${currentQuantity < 0 && 'bg-danger-transparent'}`}>Transfer Qty</th>
														<th
															className={`${
																currentSelectedItem !== undefined &&
																currentSelectedItem.stocks - currentQuantity < 0 &&
																'bg-danger-transparent'
															}`}
														>
															After Transfer
														</th>
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
																	{currentSelectedItem?.itemName ?? 'unselected'}
																</Link>
															</div>
														</td>
														<td title="This is read only property">{currentSelectedItem?.id ?? '0'}</td>
														<td title="This is read only property" className="text-center">
															{currentSelectedItem?.stocks ?? '0'}
														</td>
														<td className={`${currentQuantity < 0 && 'bg-danger-transparent'}`}>
															<div className="product-quantity bg-gray-transparent border-0">
																<span className="quantity-btn" onClick={() => setCurrentQuantity(currentQuantity - 1)}>
																	<MinusCircle />
																</span>
																<>
																	<input
																		name="quantity"
																		type="text"
																		className="quantity-input bg-transparent"
																		value={currentQuantity}
																		onChange={e => {
																			e.preventDefault();
																			const value = Number(e.target.value);
																			if (isNaN(value)) return;
																			setCurrentQuantity(value);
																		}}
																	/>
																</>
																<span className="quantity-btn" onClick={() => setCurrentQuantity(currentQuantity + 1)}>
																	+
																	<PlusCircle className="plus-circle" />
																</span>
															</div>
														</td>
														{currentSelectedItem !== undefined && (
															<td
																className={`text-center ${
																	currentSelectedItem.stocks - currentQuantity < 0 && 'bg-danger-transparent'
																}`}
															>
																{currentSelectedItem.stocks - currentQuantity}
															</td>
														)}
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
							<input type="hidden" name="itemId" value={currentSelectedItem?.id ?? '0'} />
							<input type="hidden" name="tenantId" value={tenantId ?? '0'} />
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
								Cancel
							</button>
							<button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
								Confirm
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
