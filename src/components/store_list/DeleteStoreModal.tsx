import { Store } from '@/_classes/Store';
import { useEffect, useState } from 'react';

export default function SetActiveModal({
	currentSelectedStore,
	onAction,
}: {
	currentSelectedStore?: Store;
	onAction: (store: Store) => void;
}) {
	const [currentStore, setCurrentStore] = useState<Store | undefined>(currentSelectedStore);
	useEffect(() => {
		setCurrentStore(currentSelectedStore);
	}, [currentSelectedStore]);

	return (
		<>
			{/* Delete */}
			<div className="modal fade" id="delete-modal">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="page-wrapper-new p-0">
							<div className="p-5 px-3 text-center">
								<span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2">
									<i className="ti ti-trash fs-24 text-danger" />
								</span>
								<h4 className="fs-20 text-gray-9 fw-bold mb-2 mt-1">
									{currentStore?.isActive === true ? 'Delete' : 'Undo'} {currentStore?.name}
								</h4>
								<p className="text-gray-6 mb-0 fs-16">
									{currentStore?.isActive === true ? (
										<>
											Are you sure you want to delete {currentStore?.name} ? <br />
											(Deleted store will be archived into history and deleted in 30 Days)
										</>
									) : (
										<>
											Are you sure you want to undo delete {currentStore?.name} ? <br />
											(Undo store will restore the record)
										</>
									)}
								</p>
								<div className="modal-footer-btn mt-3 d-flex justify-content-center">
									<button
										type="button"
										className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
										data-bs-dismiss="modal"
									>
										Cancel
									</button>
									<button
										type="button"
										data-bs-dismiss="modal"
										className="btn btn-primary fs-13 fw-medium p-2 px-3"
										onClick={() => currentStore && onAction(currentStore)}
									>
										Yes {currentStore?.isActive === true ? 'Delete' : 'Undo'}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
