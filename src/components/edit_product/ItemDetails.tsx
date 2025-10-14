'use client';
import Link from 'next/link';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { Info, LifeBuoy, PlusCircle } from 'react-feather';
import AsyncSelect from 'react-select/async';

import { CategoryWithItem } from '@/_classes/Item';
import { Tenant } from '@/_classes/Tenant';
import { CategoryWithItemDef } from '@/_interface/CategoryDef';
import { HTTPResult } from '@/_interface/HTTPResult';
import { getCategories, registerCategory } from '@/_lib/category';
import { editWarehouseItem, findCompleteById } from '@/_lib/warehouse';
import { useFormState } from '@/components/hooks/useFormState';
import SectionLoading from '@/components/partials/SectionLoading';
import { useTenant } from '@/components/provider/TenantProvider';

export function ItemDetails({ itemId }: { itemId: number }) {
	const [isMounted, setIsMounted] = useState(false);
	const { data, isStateLoading: loadingUserTenant } = useTenant();
	const formState = useFormState();

	// Maintain current item if it's change or not
	const [initialItem, setInitialItem] = useState<CategoryWithItem | null>(null);
	const [currentItem, setCurrentItem] = useState<CategoryWithItem | null>(null);

	// Input
	const [addAndReduceCounter, setAddAndReduceCounter] = useState(0);
	const [inpItemName, setInpItemName] = useState('');
	const [changedCategory, setChangedCategory] = useState<{ value: number; label: string }>();

	const timeoutRef = useRef<NodeJS.Timeout>(undefined);
	const selectedTenant: Tenant | undefined = data.tenantList.find(tenant => tenant.id === data.selectedTenantId);

	const handleForm: FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();

		const { isFormLoading } = formState.state;
		if (isFormLoading || !currentItem || !selectedTenant) return;
		formState.setFormLoading(true);

		try {
			const formData = new FormData(e.currentTarget);

			// Run both async calls sequentially (they depend on each other)
			const { error: categoryError } = await registerCategory(formData, initialItem?.categoryId ?? 0);
			if (categoryError) throw new Error(categoryError);

			const { error: itemError } = await editWarehouseItem(formData);
			if (itemError) throw new Error(itemError);

			// Success
			formState.setSuccess({ message: 'Update success' });
			setAddAndReduceCounter(0);
			setCurrentItem(v =>
				v
					? new CategoryWithItem({
							category_id: changedCategory?.value ?? 0,
							category_name: changedCategory?.label ?? '',
							item_name: inpItemName,
							item_id: v.itemId,
							stocks: v.stocks + addAndReduceCounter,
					  })
					: null
			);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			console.warn(err);
			formState.setError({ message });
		} finally {
			formState.setFormLoading(false);
		}
	};

	const handleGetCategory = async (keyword: string): Promise<{ value: string; label: string }[]> => {
		if (selectedTenant === undefined) return [];

		try {
			const { error, result } = await getCategories(selectedTenant.id, 1, 10, keyword);
			if (error === null) {
				return result!.categoryDefs.map(def => ({ value: def.id!.toString(), label: def.category_name! }));
			} else {
				formState.setError({ message: error });
				return [];
			}
		} catch (e) {
			const error = e as Error;
			console.error(`[ERROR] ${error.message}`);
			formState.setError({ message: `Unexpected error: ${error.message}` });
			return [];
		}
	};

	const loadCategoryOptions = (inputValue: string, callback: (options: { value: string; label: string }[]) => void) => {
		/*
			When user not yet complete type then
			cancel previous request
		*/
		if (timeoutRef !== undefined) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(async () => callback(await handleGetCategory(inputValue)), 150);
	};

	/*
		Triggered if current user tenant is change
		also triggered at first open the page
	*/
	useEffect(() => {
		async function getData() {
			if (formState.state.isFormLoading) return;
			formState.setFormLoading(true);

			try {
				// If tenant not selected then it's an error
				if (selectedTenant === undefined) {
					// Sometime at the first time page load, then the tenant not yet arrived
				} else {
					const { result, error }: HTTPResult<CategoryWithItemDef> = await findCompleteById(itemId, selectedTenant.id);
					if (error !== null) {
						formState.setError({ message: error });
					} else {
						setCurrentItem(new CategoryWithItem(result!));
						setInpItemName(result!.item_name);
						setInitialItem(new CategoryWithItem(result!));
					}
				}
			} catch (e) {
				const error = e as Error;
				console.error(`[ERROR] ${error.message}`);
				formState.setError({ message: `Unexpected error: ${error.message}` });
			} finally {
				formState.setFormLoading(false);
			}
		}

		getData();
		// getAvailableCategories();
	}, [selectedTenant]);

	/*
		Some component may take a time to render,
		Otherwise it will hydration error
	*/
	useEffect(() => setIsMounted(true), []);

	if (formState.state.isFormLoading || loadingUserTenant || !isMounted)
		return <SectionLoading caption={`Loading ${selectedTenant?.name ?? ''} items`} />;

	return (
		<>
			{/* Success Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					id="liveToast"
					className={`toast ${formState.state.isSuccess ? 'show' : ''} colored-toast bg-success-transparent`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-success text-fixed-white">
						<strong className="me-auto">Success !</strong>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="toast"
							aria-label="Close"
							onClick={() => formState.setState({ success: false })}
						></button>
					</div>
					<div className="toast-body">{formState.value.successMessage}</div>
				</div>
			</div>

			{/* Error Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					id="liveToast"
					className={`toast ${formState.state.isError ? 'show' : ''} colored-toast bg-danger-transparent`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-danger text-fixed-white">
						<strong className="me-auto">Warning</strong>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="toast"
							aria-label="Close"
							onClick={() => formState.setState({ error: false })}
						></button>
					</div>
					<div className="toast-body">{formState.value.errorMessage}</div>
				</div>
			</div>

			{/* Add Category */}
			<div className="modal fade" id="add-units-category">
				<div className="modal-dialog modal-dialog-centered custom-modal-two">
					<div className="modal-content">
						<div className="page-wrapper-new p-0">
							<div className="modal-header border-0 custom-modal-header">
								<div className="page-title">
									<h4>Add New Category</h4>
								</div>
								<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">×</span>
								</button>
							</div>
							<div className="modal-body custom-modal-body">
								<div className="mb-3">
									<label className="form-label">Name</label>
									<input type="text" className="form-control" />
								</div>
							</div>
							<div className="modal-footer">
								<Link href="#" className="btn btn-cancel me-2" data-bs-dismiss="modal">
									Cancel
								</Link>
								<Link href="#" className="btn btn-submit">
									Submit
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>

			<form className="add-product-form" onSubmit={handleForm}>
				<input type="hidden" name="tenantId" value={selectedTenant?.id ?? 0} />
				<input type="hidden" name="itemId" value={itemId} />
				<div className="add-product">
					<div className="accordions-items-seperate" id="accordionSpacingExample">
						<div className="accordion-item border mb-4">
							<h2 className="accordion-header" id="headingSpacingOne">
								<div
									className="accordion-button collapsed bg-white"
									data-bs-toggle="collapse"
									data-bs-target="#SpacingOne"
									aria-expanded="true"
									aria-controls="SpacingOne"
								>
									<div className="d-flex align-items-center justify-content-between flex-fill">
										<h5 className="d-flex align-items-center">
											<Info className="text-primary me-2" />
											<span>Product Information</span>
										</h5>
									</div>
								</div>
							</h2>
							<div id="SpacingOne" className="accordion-collapse collapse show" aria-labelledby="headingSpacingOne">
								<div className="accordion-body border-top">
									<div className="row">
										<div className="col-sm-6 col-12">
											<div className="mb-3">
												<label className="form-label">
													Product Name
													<span className="text-danger ms-1">*</span>
												</label>
												{/*	In DB this is item_name */}
												<input
													type="text"
													className="form-control"
													name="productName"
													onChange={e => setInpItemName(e.target.value)}
													value={inpItemName}
												/>
											</div>
										</div>
										<div className="col-sm-6 col-12">
											<div className="mb-3">
												<label className="form-label">
													Unit<span className="text-danger ms-1">*</span>
												</label>
												<input type="text" className="form-control" value="PC" disabled />
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-sm-6 col-12">
											<div className="mb-3">
												<div className="add-newplus">
													<label className="form-label">
														Category
														<span className="text-danger ms-1">*</span>
													</label>
													<Link href="#" data-bs-toggle="modal" data-bs-target="#add-units-category">
														<PlusCircle data-feather="plus-circle" className="plus-down-add" />
														<span>Add New</span>
													</Link>
												</div>
												<AsyncSelect
													className="react-select"
													loadOptions={loadCategoryOptions}
													placeholder="Choose"
													name="categoryId"
													isClearable
													onChange={e => setChangedCategory({ label: e?.label ?? '', value: Number(e?.value) })}
													defaultValue={
														currentItem?.categoryId && currentItem?.categoryName
															? {
																	value: currentItem.categoryId.toString(),
																	label: currentItem.categoryName,
															  }
															: null
													}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
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
											<LifeBuoy data-feather="life-buoy" className="text-primary me-2" />
											<span>Pricing & Stocks</span>
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
															<label className="form-label">Current Quantity</label>
															<input
																type="number"
																className="form-control"
																name="quantity"
																disabled
																placeholder="0"
																defaultValue={currentItem?.stocks ?? '0'}
															/>
														</div>
													</div>
													<div className="col-lg-4 col-sm-6 col-12">
														<div className="mb-3">
															<label className="form-label">Add or Reduce (+/-)</label>
															<input
																type="number"
																className="form-control"
																name="quantity"
																defaultValue={addAndReduceCounter}
																onChange={e => setAddAndReduceCounter(Number(e.target.value))}
															/>
														</div>
													</div>
													<div className="col-lg-4 col-sm-6 col-12">
														<div className="mb-3">
															<label className="form-label">After edit</label>
															<input
																type="number"
																className="form-control"
																name="quantity"
																disabled
																value={(currentItem?.stocks ?? 0) + addAndReduceCounter}
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
				</div>
				<div className="col-lg-12">
					<div className="d-flex align-items-center justify-content-end mb-4">
						<button type="reset" className="btn btn-secondary me-2">
							Clear
						</button>
						<button type="submit" className="btn btn-primary">
							Confirm
						</button>
					</div>
				</div>
			</form>
		</>
	);
}
