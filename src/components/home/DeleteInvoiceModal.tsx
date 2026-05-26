import { OnClickYesDeleteInvoiceBtn } from '@/_classes/HomeDashboardEvent';
import { useHomeDashboard } from '@/components/provider/HomeDashboardProvider';
import { Tooltip } from 'antd';
import { AlertCircle } from 'react-feather';

export default function DeleteInvoiceModal() {
	const { tobeDeletedInvoiceId: id, onEvent } = useHomeDashboard();

	return (
		<div className="modal fade" id="delete-invoice">
			<div className="modal-dialog modal-dialog-centered stock-adjust-modal">
				<div className="modal-content">
					<div className="modal-header">
						<div className="page-title">
							<h4>
								Delete Invoice {id}
								<Tooltip title="Sensitive data. Proceed with caution">
									<AlertCircle className="ms-2 mb-1" size={16} color="red" />
								</Tooltip>
							</h4>
						</div>
						<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button>
					</div>
					<div className="p-3 px-3 text-center">
						<p className="text-gray-6 mb-0 fs-16">
							Are you sure you want to delete invoice with id {id} ? <br />
							(Deleted invoice will be archived into history)
						</p>
						<div className="modal-footer-btn mt-3 d-flex justify-content-center">
							<div className="modal-footer-btn mt-0 d-flex justify-content-center">
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
									onClick={() => onEvent(new OnClickYesDeleteInvoiceBtn(id))}
								>
									Yes
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
