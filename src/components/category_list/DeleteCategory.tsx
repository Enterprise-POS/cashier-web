import Link from 'next/link';
import { MouseEvent } from 'react';

import { Category } from '@/_classes/Category';
import { deleteCategory } from '@/_lib/category';
import { useFormState } from '@/components/hooks/useFormState';

function DeleteCategory({
	tenantId,
	tobeDeletedCategory,
	onDeletedCategory,
}: {
	tenantId?: number;
	tobeDeletedCategory?: Category;
	onDeletedCategory: (id: number) => void;
}) {
	const formState = useFormState();
	async function onDeleteCategory(e: MouseEvent<HTMLAnchorElement>) {
		e.preventDefault();
		if (formState.state.isFormLoading) return;
		formState.setFormLoading(true);

		try {
			if (tenantId !== undefined && tobeDeletedCategory !== undefined) {
				const { error } = await deleteCategory(tenantId, tobeDeletedCategory.id);
				if (error !== null) {
					formState.setError({ message: error });
				} else {
					// Will trigger error=false and success=true
					// which will not show error message when next panel open
					formState.setSuccess({ message: '' });

					// Lifted up state
					onDeletedCategory(tobeDeletedCategory.id);

					// Hide bootstrap modal
					const modalElement = document.getElementById('delete-modal');
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
	}

	return (
		<div className="modal fade" id="delete-modal">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="page-wrapper-new p-0">
						<div className="p-5 px-3 text-center">
							<span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2">
								<i className="ti ti-trash fs-24 text-danger" />
							</span>
							<h4 className="fs-20 fw-bold mb-2 mt-1">Delete {tobeDeletedCategory?.categoryName ?? ''} </h4>
							<p className="mb-0 fs-16">
								Are you sure you want to delete this category ? <br />
								Deleting <em>{tobeDeletedCategory?.categoryName ?? ''}</em> also delete the connection with the item
								that associate with this category
							</p>
							{formState.state.isError && <p className="text-danger">{formState.value.errorMessage}</p>}

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
									onClick={onDeleteCategory}
								>
									Yes Delete
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DeleteCategory;
