'use client';

import { useState } from 'react';

const AddNewStore = ({ isLoading, onClick }: { isLoading: boolean; onClick: (storeName: string) => void }) => {
	const [inpStoreName, setStoreName] = useState('');

	return (
		<>
			<div className="modal fade" id="add-units">
				<div className="modal-dialog modal-dialog-centered custom-modal-two">
					<div className="modal-content">
						<div className="page-wrapper-new p-0">
							<div className="modal-header border-0 custom-modal-header">
								<div className="page-title">
									<h4>Create new store</h4>
								</div>
								<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">×</span>
								</button>
							</div>
							<div className="modal-body custom-modal-body">
								<div className="mb-3">
									<label className="form-label">Store Name</label>
									<input
										type="text"
										className="form-control"
										value={inpStoreName}
										onChange={e => setStoreName(e.target.value)}
									/>
								</div>
							</div>
							<div className="modal-footer">
								<button className="btn btn-cancel me-2" data-bs-dismiss="modal">
									Cancel
								</button>
								<button className="btn btn-submit" disabled={isLoading} onClick={() => onClick(inpStoreName)}>
									{isLoading ? 'Loading...' : 'Confirm'}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AddNewStore;
