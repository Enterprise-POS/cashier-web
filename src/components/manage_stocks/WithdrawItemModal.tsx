'use client';
import Link from 'next/link';
import { Delete } from 'react-feather';

import { StoreStockV2 } from '@/_classes/StoreStock';
import { WithdrawProductFromStoreRequestValue } from '@/_interface/WithdrawProductFromStoreRequestBody';

const WithdrawItemModal = ({
	tobeWithdrawStoreStock,
	tenantId,
	storeId,
	onConfirmWithdraw,
}: {
	tobeWithdrawStoreStock?: StoreStockV2;
	tenantId: number;
	storeId: number;
	onConfirmWithdraw: (reqBody: WithdrawProductFromStoreRequestValue) => void;
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
								{tobeWithdrawStoreStock === undefined ? (
									<h4>Error. Please contact staff immediately</h4>
								) : (
									<>
										<h4 className="fs-20 fw-bold mb-2 mt-1">Withdraw Item</h4>
										<p className="mb-0 fs-16">
											Withdrawing <i className="text-primary">{tobeWithdrawStoreStock.itemName}</i> will transfer all
											remaining stock back to the warehouse and remove the product from the store&apos;s item list.
										</p>
									</>
								)}
								<div className="modal-footer-btn mt-3 d-flex justify-content-center">
									<button
										type="button"
										className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
										data-bs-dismiss="modal"
									>
										Cancel
									</button>
									{tobeWithdrawStoreStock !== undefined && (
										<button
											data-bs-dismiss="modal"
											className="btn btn-primary fs-13 fw-medium p-2 px-3"
											onClick={() =>
												onConfirmWithdraw({
													storeId,
													tenantId,
													itemId: tobeWithdrawStoreStock.itemId,
													itemName: tobeWithdrawStoreStock.itemName,
													storeStockId: tobeWithdrawStoreStock.id,
												})
											}
										>
											Confirm
										</button>
									)}
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
