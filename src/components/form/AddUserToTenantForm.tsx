'use client';
import { useRouter } from 'next/navigation';
import { FormEventHandler, useState } from 'react';
import { User } from 'react-feather';

import { Tenant } from '@/_classes/Tenant';
import { addUserToTenant } from '@/_lib/action';
import { all_routes } from '@/components/core/data/all_routes';
import { useTenant } from '@/components/provider/TenantProvider';

export default function AddUserToTenantForm({ userId }: { userId: number }) {
	const router = useRouter();
	const { data } = useTenant();
	const [userEmailInput, setUserEmailInput] = useState('');
	const [isFormLoading, setFormLoading] = useState(false);

	// Success Toast
	const [showSuccessToast, setShowSuccessToast] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	// Error Toast
	const [errorMessage, setErrorMessage] = useState('');
	const [showErrorToast, setShowErrorToast] = useState(false);

	const selectedTenant: Tenant | undefined = data.tenantList.find(tenant => tenant.id === data.selectedTenantId);

	const handleForm: FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();

		setFormLoading(true);
		// await new Promise((res, _) => setTimeout(res, 1500));
		const formData = new FormData(e.currentTarget);
		const { error } = await addUserToTenant(formData);
		if (error !== null) {
			console.error(error);
			setErrorMessage(error);
			setShowErrorToast(true);
			setTimeout(() => setShowErrorToast(false), 5000);
		} else {
			// the result will return nothing, just text with 'Created'

			// 3 seconds showing toast
			// after 3 second hide from screen
			setShowSuccessToast(true);
			setSuccessMessage(`New member added successfully !`);

			// reset FormData input
			setUserEmailInput('');

			// If success then navigate to tenant_members
			router.push(all_routes.tenantMembers);
		}
		setFormLoading(false);
	};

	return (
		<>
			{/* Success Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					id="liveToast"
					className={`toast ${showSuccessToast ? 'show' : ''} colored-toast bg-success-transparent`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-success text-fixed-white">
						<strong className="me-auto">Congratulation !</strong>
						<button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
					</div>
					<div className="toast-body">{successMessage}</div>
				</div>
			</div>

			{/* Error Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					id="liveToast"
					className={`toast ${showErrorToast ? 'show' : ''} colored-toast bg-danger-transparent`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-danger text-fixed-white">
						<strong className="me-auto">Warning</strong>
						<button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
					</div>
					<div className="toast-body">{errorMessage}</div>
				</div>
			</div>

			{/* Form */}
			<form onSubmit={handleForm}>
				<div className="accordions-items-seperate" id="accordionSpacingExample">
					<div className="accordion-item border mb-4">
						<h2 className="accordion-header" id="headingSpacingTwo">
							<div
								className="accordion-button collapsed bg-white"
								data-bs-toggle="collapse"
								data-bs-target="#SpacingTwo"
								aria-expanded="true"
								aria-controls="SpacingTwo"
							>
								<div className="d-flex align-items-center justify-content-between flex-fill">
									<h5 className="d-flex align-items-center">
										<User data-feather="home" className="text-primary me-2" />
										<span>User Information</span>
									</h5>
								</div>
							</div>
						</h2>
						<div id="SpacingTwo" className="accordion-collapse collapse show" aria-labelledby="headingSpacingTwo">
							<div className="accordion-body border-top">
								<div className="tab-content" id="pills-tabContent">
									<div
										className="tab-pane fade show active"
										id="pills-home"
										role="tabpanel"
										aria-labelledby="pills-home-tab"
									>
										<div className="single-product">
											<div className="row">
												<div className="col-lg-4 col-sm-6 col-12">
													<div className="mb-3">
														<label className="form-label" htmlFor="userId">
															ID
															<span className="text-danger ms-1">*</span>
														</label>
														<input
															disabled={isFormLoading}
															type="text"
															id="userId"
															placeholder="12345678"
															className="form-control"
															value={userEmailInput}
															onChange={e => setUserEmailInput(e.target.value)}
															name="user-id"
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-lg-12">
					<div className="d-flex align-items-center justify-content-end mb-4">
						<button type="button" className="btn btn-secondary me-2" disabled={isFormLoading}>
							Cancel
						</button>
						<button type="submit" className="btn btn-primary" disabled={isFormLoading}>
							{isFormLoading ? (
								<div className="spinner-border spinner-border-sm me-1" role="status">
									<span className="sr-only">Loading...</span>
								</div>
							) : (
								'Submit'
							)}
						</button>
					</div>
				</div>
				<input id="ownerUserId" type="hidden" value={userId} name="performer-id" />
				<input id="ownerUserId" type="hidden" value={selectedTenant?.id ?? 0} name="tenant-id" />
			</form>
		</>
	);
}
