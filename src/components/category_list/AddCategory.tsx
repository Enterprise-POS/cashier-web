import { FormEventHandler, useState } from 'react';

import { Category } from '@/_classes/Category';
import { CategoryDef } from '@/_interface/CategoryDef';
import { HTTPResult } from '@/_interface/HTTPResult';
import { addCategory } from '@/_lib/category';
import { useFormState } from '@/components/hooks/useFormState';

export default function AddCategory({
	tenantId,
	onAddCategory,
}: {
	tenantId?: number;
	onAddCategory: (c: Category) => void;
}) {
	// Add Category Form
	const [inpCategory, setInpCategory] = useState('');
	const formState = useFormState();

	const handleForm: FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();
		if (formState.state.isFormLoading) return;
		formState.setFormLoading(true);

		try {
			if (tenantId !== undefined) {
				const formData = new FormData(e.currentTarget);
				const { result, error }: HTTPResult<CategoryDef> = await addCategory(formData);
				if (error !== null) {
					formState.setError({ message: error });
				} else {
					// Will trigger error=false and success=true
					// which will not show error message when next panel open
					formState.setSuccess({ message: '' });

					// Lifted up state
					onAddCategory(new Category(result!));

					// Reset this component state
					setInpCategory('');

					// Hide bootstrap modal
					const modalElement = document.getElementById('add-category');
					if (modalElement !== null) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const win = window as any;
						const Modal = win.bootstrap.Modal;
						if (modalElement) {
							const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
							modal.hide();
						}
					} else {
						// Unexpected behavior
						formState.setError({ message: 'Request completed, you can close the panel' });
					}
				}
			} else {
				// Probably tenant not yet available or user not yet joined any tenant
			}
		} catch (e) {
			const error = e as Error;
			console.error(`[ERROR] ${error.message}`);
			formState.setError({ message: `Unexpected error: ${error.message}` });
		} finally {
			formState.setFormLoading(false);
		}
	};

	/*
		Feature such as dismiss modal
		will be handled by bootstrap
		see label -> data-bs-dismiss="modal"
	*/
	return (
		<form onSubmit={handleForm}>
			<div className="modal fade" id="add-category">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="page-wrapper-new p-0">
							<div className="modal-header">
								<div className="page-title">
									<h4>Add Category</h4>
								</div>
								<button
									type="button"
									className="close bg-danger text-white fs-16"
									data-bs-dismiss="modal"
									aria-label="Close"
								>
									<span aria-hidden="true">×</span>
								</button>
							</div>
							<div className="modal-body">
								<input type="hidden" name="tenantId" value={tenantId} />
								<div className="mb-3">
									<label className="form-label" htmlFor="categoryName">
										Category Name (max 15 characters)<span className="text-danger ms-1">*</span>
									</label>
									<input
										type="text"
										className={`form-control ${formState.state.isError ? 'is-invalid' : ''}`}
										value={inpCategory}
										id="categoryName"
										name="categoryName"
										onChange={e => setInpCategory(e.target.value)}
									/>
									<div className="invalid-feedback">{formState.value.errorMessage}</div>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
									data-bs-dismiss="modal"
								>
									Cancel
								</button>
								<button
									className="btn btn-primary fs-13 fw-medium p-2 px-3"
									disabled={formState.state.isFormLoading}
									type="submit"
								>
									{formState.state.isFormLoading ? (
										<div className="spinner-border spinner-border-sm me-1" role="status">
											<span className="sr-only">Loading...</span>
										</div>
									) : (
										<>Add Category</>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
}
