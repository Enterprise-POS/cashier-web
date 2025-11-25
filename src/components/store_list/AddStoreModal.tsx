import { StoreDef } from '@/_interface/StoreDef.js';
import { MouseEventHandler, useRef, useState } from 'react';

export default function AddStoreModal({
	disabled,
	tenantId,
	onAddStore,
}: {
	disabled: boolean;
	tenantId: number;
	onAddStore: (newStore: StoreDef) => void;
}) {
	const [currentNewStoreName, setNewStoreName] = useState('');
	const categoryNameInpRef = useRef<HTMLInputElement | null>(null);

	const onConfirmation: MouseEventHandler<HTMLButtonElement> = function (e): void {
		e.preventDefault();
		if (disabled || currentNewStoreName === '') return;
		onAddStore({
			// Ignored value
			id: 0,
			created_at: new Date().toISOString(),

			// Required value
			name: currentNewStoreName,
			is_active: true,
			tenant_id: tenantId,
		});
		setNewStoreName('');
	};

	return (
		<div className="modal fade" id="add-units">
			<div className="modal-dialog modal-dialog-centered stock-adjust-modal">
				<div className="modal-content">
					<div className="modal-header">
						<div className="page-title">
							<h4>New Store</h4>
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
											Store Name<span className="text-danger ms-1">*</span>
										</label>
										<div className="bg-gray-transparent border-0">
											<input
												id="categoryName"
												name="categoryName"
												type="text"
												className={`form-control`}
												value={currentNewStoreName}
												onChange={e => setNewStoreName(e.target.value)}
												ref={categoryNameInpRef}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
								Cancel
							</button>
							<button className="btn btn-primary" data-bs-dismiss="modal" onClick={onConfirmation} disabled={disabled}>
								Confirm
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
