'use client';
import { FormEventHandler, useEffect, useState } from 'react';
import { Info, LifeBuoy } from 'react-feather';

import { Item } from '@/_classes/Item';
import { Tenant } from '@/_classes/Tenant';
import { HTTPResult } from '@/_interface/HTTPResult';
import { ItemDef } from '@/_interface/ItemDef';
import { editWarehouseItem, getItemFindById } from '@/_lib/warehouse';
import { useFormState } from '@/components/hooks/useFormState';
import SectionLoading from '@/components/partials/SectionLoading';
import { useTenant } from '@/components/provider/TenantProvider';

export function ItemDetails({ itemId }: { itemId: number }) {
	const { data, isStateLoading: loadingUserTenant } = useTenant();
	const formState = useFormState();
	const [currentItem, setCurrentItem] = useState<Item | null>(null);
	const [addAndReduceCounter, setAddAndReduceCounter] = useState(0);
	const [inpItemName, setInpItemName] = useState('');
	const selectedTenant: Tenant | undefined = data.tenantList.find(tenant => tenant.id === data.selectedTenantId);

	const handleForm: FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();
		if (formState.state.isFormLoading || currentItem === null) return;
		formState.setFormLoading(true);

		/*
			Required input
			- itemName
			- quantity
			- tenantId (hidden)
		*/
		try {
			const formData = new FormData(e.currentTarget);
			const { error } = await editWarehouseItem(formData);
			if (error !== null) {
				formState.setError({ message: error });
			} else {
				formState.setSuccess({ message: 'Update success' });
				setCurrentItem(
					(v: Item | null) =>
						new Item({
							item_name: inpItemName,
							stocks: v!.stocks + addAndReduceCounter,
							created_at: v!.createdAt.toString(),
							is_active: v!.isActive,
							item_id: v!.id,
						})
				);
			}
		} catch (e) {
			const error = e as Error;
			console.warn(error);
			formState.setError({ message: error.message });
		} finally {
			formState.setFormLoading(false);
		}
	};

	useEffect(() => {
		async function getData() {
			if (formState.state.isFormLoading) return;
			formState.setFormLoading(true);

			try {
				// If tenant not selected then it's an error
				if (selectedTenant === undefined) {
					// Sometime at the first time page load, then the tenant not yet arrived
				} else {
					const { result, error }: HTTPResult<ItemDef> = await getItemFindById(itemId, selectedTenant.id);
					if (error !== null) {
						formState.setError({ message: error });
					} else {
						setCurrentItem(new Item(result!));
						setInpItemName(result!.item_name);
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
	}, [selectedTenant]);

	if (formState.state.isFormLoading || loadingUserTenant)
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
													disabled={formState.state.isFormLoading}
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
											<span>Pricing &amp; Stocks</span>
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
																disabled={formState.state.isFormLoading}
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
						<button type="reset" className="btn btn-secondary me-2" disabled={formState.state.isFormLoading}>
							Clear
						</button>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={formState.state.isFormLoading}
							style={{ cursor: formState.state.isFormLoading ? 'progress' : 'pointer' }}
						>
							{formState.state.isFormLoading ? (
								<div className="spinner-border spinner-border-sm me-1" role="status">
									<span className="sr-only">Loading...</span>
								</div>
							) : (
								<>Confirm</>
							)}
						</button>
					</div>
				</div>
			</form>
		</>
	);
}
