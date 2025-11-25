'use client';
import Link from 'next/link';
import { Delete } from 'react-feather';

import { StoreStockV2 } from '@/_classes/StoreStock';
import { TransferStockRequest } from '@/_interface/TransferStock';

const WithdrawItemModal = ({
	storeId,
	tenantId,
	tobeWithdrawStoreStock,
	onConfirmWithdraw,
}: {
	storeId: number;
	tenantId: number;
	tobeWithdrawStoreStock?: StoreStockV2;
	onConfirmWithdraw: (v: TransferStockRequest) => void;
}) => {
	return (
		<>
			{/* delete modal */}
			<div className="modal fade" id="delete-modal">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="page-wrapper-new p-0">
							<div className="p-5 px-3 text-center">
								<span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2">
									<Delete className="ti ti-trash fs-24 text-danger" />
								</span>
								<h4 className="fs-20 fw-bold mb-2 mt-1">Withdraw Item</h4>
								<p className="mb-0 fs-16">
									Are you sure you want to empty {tobeWithdrawStoreStock?.itemName ?? 'unselected'} stock. Emptying
									stock will be transfer all leftover stock into warehouse.
								</p>
								<div className="modal-footer-btn mt-3 d-flex justify-content-center">
									<button
										type="button"
										className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
										data-bs-dismiss="modal"
									>
										Cancel
									</button>
									<Link
										href="#"
										data-bs-dismiss="modal"
										className="btn btn-primary fs-13 fw-medium p-2 px-3"
										onClick={() => {
											if (tobeWithdrawStoreStock === undefined) return;
											onConfirmWithdraw({
												// Withdrawing items means zero store stock, so just give all the leftover minus
												quantity: -tobeWithdrawStoreStock.stocks,
												storeId: storeId,
												tenantId: tenantId,
												itemId: tobeWithdrawStoreStock.itemId,
											});
										}}
									>
										Confirm
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default WithdrawItemModal;
