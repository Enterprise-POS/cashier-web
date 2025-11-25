import Link from 'next/link.js';
import Select from 'react-select';

import { Store } from '@/_classes/Store';

export function AddNewItem({
	storeList,
	currentSelectedStoreId,
	onNewTransferItem,
}: {
	storeList: Store[];
	currentSelectedStoreId: number;
	onNewTransferItem: () => void;
}) {
	const currentSelectedStore = storeList.find(s => s.id === currentSelectedStoreId);

	return (
		<>
			{/* Add Stock */}
			<div className="modal fade" id="add-store">
				<div className="modal-dialog modal-dialog-centered stock-adjust-modal">
					<div className="modal-content">
						<div className="modal-header">
							<div className="page-title">
								<h4>Add Stock</h4>
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
											<input type="text" className="form-control" placeholder="Select Product" />
											<i data-feather="search" className="feather-search" />
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
									Cancel
								</button>
								<Link href="#" className="btn btn-primary" data-bs-dismiss="modal">
									Confirm
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
			{/* /Add Stock */}

			{/* {createPortal(<div className="modal-backdrop fade show">modal-backdrop fade show</div>, document.body)} */}
		</>
	);
}
