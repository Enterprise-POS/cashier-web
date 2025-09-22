import { Category } from '@/_classes/Category';
import { editCategory } from '@/_lib/category';
import { useFormState } from '@/components/hooks/useFormState';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

export default function EditCategory({
	tobeEditedCategory,
	tenantId,
	onEditedCategory,
}: {
	tobeEditedCategory?: Category;
	tenantId?: number;
	onEditedCategory: (c: Category) => void;
}) {
	const [currentCategoryName, setCurrentCategoryName] = useState('');
	const [currentCategoryId, setCurrentCategoryId] = useState(0);
	const categoryNameInpRef = useRef<HTMLInputElement | null>(null);
	const formState = useFormState();

	const handleForm: FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();
		if (formState.state.isFormLoading) return;
		formState.setFormLoading(true);

		try {
			if (tenantId !== undefined && tobeEditedCategory !== undefined) {
				const formData = new FormData(e.currentTarget);
				const { result, error } = await editCategory(formData);
				if (error !== null) {
					formState.setError({ message: error });
				} else {
					// Will trigger error=false and success=true
					// which will not show error message when next panel open
					formState.setSuccess({ message: '' });

					// Lifting up state
					onEditedCategory(new Category(result!));

					// Reset this component state
					setCurrentCategoryId(0);
					setCurrentCategoryName('');

					// Hide bootstrap modal
					const modalElement = document.getElementById('edit-category');
					if (modalElement !== null) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const win = window as any;
						const Modal = win.bootstrap.Modal;
						if (modalElement) {
							const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
							modal.hide();
						}
					} else {
						// [ERROR] Unexpected behavior
						formState.setError({ message: 'Request completed, you can close the panel' });
					}
				}
			} else {
				// Do nothing ...
			}
		} catch (e) {
			const error = e as Error;
			console.error(`[ERROR] ${error.message}`);
			formState.setError({ message: `Unexpected error: ${error.message}` });
		} finally {
			formState.setFormLoading(false);
		}
	};

	useEffect(() => {
		if (tobeEditedCategory === undefined) return;
		setCurrentCategoryName(tobeEditedCategory.categoryName);
		setCurrentCategoryId(tobeEditedCategory.id);

		// This will hide the error message in case user
		// crate a bad request, so the next open
		// error message will be hided
		formState.setState({ error: false });
	}, [tobeEditedCategory]);

	useEffect(() => {
		// If possible, current scope useEffect will give auto input
		// when user open modal
		const modalElement = document.getElementById('edit-category');
		if (!modalElement) return;

		const handleShown = () => categoryNameInpRef.current?.focus();
		modalElement.addEventListener('shown.bs.modal', handleShown);

		return () => {
			modalElement.removeEventListener('shown.bs.modal', handleShown);
		};
	}, []);

	return (
		<form onSubmit={handleForm}>
			<div className="modal fade" id="edit-category">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="page-wrapper-new p-0">
							<div className="modal-header">
								<div className="page-title">
									<h4>Edit Category</h4>
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
								<div className="mb-3">
									<input type="hidden" name="tenantId" value={tenantId ?? 0} />
									<input type="hidden" name="categoryId" value={currentCategoryId} />

									{/* Category input */}
									<label className="form-label" htmlFor="categoryName">
										Category Name (max 15 characters)<span className="text-danger ms-1">*</span>
									</label>
									<input
										id="categoryName"
										name="categoryName"
										type="text"
										className={`form-control ${formState.state.isError ? 'is-invalid' : ''}`}
										value={currentCategoryName}
										onChange={e => setCurrentCategoryName(e.target.value)}
										ref={categoryNameInpRef}
									/>
									{formState.state.isError && <div className="invalid-feedback">{formState.value.errorMessage}</div>}
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
									type="submit"
									disabled={formState.state.isFormLoading || tobeEditedCategory === undefined}
								>
									Save Changes
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
}
