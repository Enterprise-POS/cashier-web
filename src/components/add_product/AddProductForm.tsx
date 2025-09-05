'use client';

import { FormEventHandler } from 'react';
import { Info, LifeBuoy } from 'react-feather';

import { Tenant } from '@/_classes/Tenant';
import { createItem } from '@/_lib/warehouse';
import { useFormState } from '@/components/hooks/useFormState';
import { useTenant } from '@/components/provider/TenantProvider';

export default function AddProductForm() {
	const formState = useFormState();
	const { data } = useTenant();
	const selectedTenant: Tenant | undefined = data.tenantList.find(tenant => tenant.id === data.selectedTenantId);

	const handleForm: FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();
		if (formState.state.isFormLoading) return;
		formState.setFormLoading(true);

		try {
			const formData = new FormData(e.currentTarget);
			const { result, error } = await createItem(formData);
			if (error !== null) {
				formState.setError({ message: error });
			} else {
				formState.setSuccess({ message: `${result!.item_name} created` });
			}
		} catch (e: unknown) {
			const error = e as Error;
			console.warn(error);
		} finally {
			formState.setFormLoading(false);
		}
	};

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
							onClick={() => formState.setState({ success: false, error: null })}
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
							onClick={() => formState.setState({ success: null, error: false })}
						></button>
					</div>
					<div className="toast-body">{formState.value.errorMessage}</div>
				</div>
			</div>

			<form className="add-product-form" onSubmit={handleForm}>
				<input type="hidden" name="tenantId" value={selectedTenant?.id ?? 0} />
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
													disabled={formState.state.isFormLoading}
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
									{/* <div className="addservice-info">
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
																<Select className="react-select" options={category} placeholder="Choose" />
															</div>
														</div>
														<div className="col-sm-6 col-12">
															<div className="mb-3">
																<label className="form-label">
																	Sub Category
																	<span className="text-danger ms-1">*</span>
																</label>
																<Select className="react-select" options={subcategory} placeholder="Choose" />
															</div>
														</div>
													</div>
												</div> */}
									{/* Editor */}
									{/* <div className="col-lg-12">
													<div className="summer-description-box">
														<label className="form-label">Description</label>
														<TextEditor />
														<p className="fs-14 mt-1">Maximum 60 Words</p>
													</div>
												</div> */}
									{/* /Editor */}
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
									{/* <div className="mb-3s">
													<label className="form-label">
														Product Type
														<span className="text-danger ms-1">*</span>
													</label>
													<div className="single-pill-product mb-3">
														<ul className="nav nav-pills" id="pills-tab1" role="tablist">
															<li className="nav-item" role="presentation">
																<span
																	className="custom_radio me-4 mb-0 active"
																	id="pills-home-tab"
																	data-bs-toggle="pill"
																	data-bs-target="#pills-home"
																	role="tab"
																	aria-controls="pills-home"
																	aria-selected="true"
																>
																	<input type="radio" className="form-control" name="payment" />
																	<span className="checkmark" /> Single Product
																</span>
															</li>
															<li className="nav-item" role="presentation">
																<span
																	className="custom_radio me-2 mb-0"
																	id="pills-profile-tab"
																	data-bs-toggle="pill"
																	data-bs-target="#pills-profile"
																	role="tab"
																	aria-controls="pills-profile"
																	aria-selected="false"
																>
																	<input type="radio" className="form-control" name="sign" />
																	<span className="checkmark" /> Variable Product
																</span>
															</li>
														</ul>
													</div>
												</div> */}
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
															<label className="form-label">Quantity (0 or empty is allowed)</label>
															<input
																type="number"
																className="form-control"
																name="stocks"
																disabled={formState.state.isFormLoading}
																placeholder="0"
															/>
														</div>
													</div>
													{/* <div className="col-lg-4 col-sm-6 col-12">
																	<div className="mb-3">
																		<label className="form-label">
																			Price
																			<span className="text-danger ms-1">*</span>
																		</label>
																		<input type="number" className="form-control" />
																	</div>
																</div> */}
													{/* <div className="col-lg-4 col-sm-6 col-12">
																	<div className="mb-3">
																		<label className="form-label">
																			Tax Type
																			<span className="text-danger ms-1">*</span>
																		</label>
																		<Select className="react-select" options={taxtype} placeholder="Select Option" />
																	</div>
																</div>
																<div className="col-lg-4 col-sm-6 col-12">
																	<div className="mb-3">
																		<label className="form-label">
																			Discount Type
																			<span className="text-danger ms-1">*</span>
																		</label>
																		<Select className="react-select" options={discounttype} placeholder="Choose" />
																	</div>
																</div>
																<div className="col-lg-4 col-sm-6 col-12">
																	<div className="mb-3">
																		<label className="form-label">
																			Discount Value
																			<span className="text-danger ms-1">*</span>
																		</label>
																		<input className="form-control" type="text" />
																	</div>
																</div>
																<div className="col-lg-4 col-sm-6 col-12">
																	<div className="mb-3">
																		<label className="form-label">
																			Quantity Alert
																			<span className="text-danger ms-1">*</span>
																		</label>
																		<input type="text" className="form-control" />
																	</div>
																</div> */}
												</div>
											</div>
										</div>
										{/* <div
														className="tab-pane fade"
														id="pills-profile"
														role="tabpanel"
														aria-labelledby="pills-profile-tab"
													>
														<div className="row select-color-add">
															<div className="col-lg-6 col-sm-6 col-12">
																<div className="mb-3">
																	<label className="form-label">
																		Variant Attribute <span className="text-danger ms-1">*</span>
																	</label>
																	<div className="row">
																		<div className="col-lg-10 col-sm-10 col-10">
																			<select
																				className="form-control variant-select select-option"
																				id="colorSelect"
																				onChange={() => setProduct(true)}
																			>
																				<option>Choose</option>
																				<option>Color</option>
																				<option value="red">Red</option>
																				<option value="black">Black</option>
																			</select>
																		</div>
																		<div className="col-lg-2 col-sm-2 col-2 ps-0">
																			<div className="add-icon tab">
																				<Link
																					href="#"
																					className="btn btn-filter"
																					data-bs-toggle="modal"
																					data-bs-target="#add-units"
																				>
																					<i className="feather feather-plus-circle" />
																				</Link>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div> */}
									</div>
								</div>
							</div>
						</div>
						{/* <div className="accordion-item border mb-4">
										<h2 className="accordion-header" id="headingSpacingThree">
											<div
												className="accordion-button collapsed bg-white"
												data-bs-toggle="collapse"
												data-bs-target="#SpacingThree"
												aria-expanded="true"
												aria-controls="SpacingThree"
											>
												<div className="d-flex align-items-center justify-content-between flex-fill">
													<h5 className="d-flex align-items-center">
														<Image data-feather="image" className="text-primary me-2" />
														<span>Images</span>
													</h5>
												</div>
											</div>
										</h2>
										<div
											id="SpacingThree"
											className="accordion-collapse collapse show"
											aria-labelledby="headingSpacingThree"
										>
											<div className="accordion-body border-top">
												<div className="text-editor add-list add">
													<div className="col-lg-12">
														<div className="add-choosen">
															<div className="mb-3">
																<div className="image-upload">
																	<input type="file" />
																	<div className="image-uploads">
																		<PlusCircle data-feather="plus-circle" className="plus-down-add me-0" />
																		<h4>Add Images</h4>
																	</div>
																</div>
															</div>
															{isImageVisible1 && (
																<div className="phone-img">
																	<img src="/assets/img/products/phone-add-2.png" alt="image" />
																	<Link href="#">
																		<X className="x-square-add remove-product" onClick={handleRemoveProduct1} />
																	</Link>
																</div>
															)}
															{isImageVisible && (
																<div className="phone-img">
																	<img src="/assets/img/products/phone-add-1.png" alt="image" />
																	<Link href="#">
																		<X className="x-square-add remove-product" onClick={handleRemoveProduct} />
																	</Link>
																</div>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div> */}
						{/* <div className="accordion-item border mb-4">
										<h2 className="accordion-header" id="headingSpacingFour">
											<div
												className="accordion-button collapsed bg-white"
												data-bs-toggle="collapse"
												data-bs-target="#SpacingFour"
												aria-expanded="true"
												aria-controls="SpacingFour"
											>
												<div className="d-flex align-items-center justify-content-between flex-fill">
													<h5 className="d-flex align-items-center">
														<List data-feather="list" className="text-primary me-2" />
														<span>Custom Fields</span>
													</h5>
												</div>
											</div>
										</h2>
										<div
											id="SpacingFour"
											className="accordion-collapse collapse show"
											aria-labelledby="headingSpacingFour"
										>
											<div className="accordion-body border-top">
												<div>
													<div className="p-3 bg-light rounded d-flex align-items-center border mb-3">
														<div className=" d-flex align-items-center">
															<div className="form-check form-check-inline">
																<input
																	className="form-check-input"
																	type="checkbox"
																	id="warranties"
																	defaultValue="option1"
																/>
																<label className="form-check-label" htmlFor="warranties">
																	Warranties
																</label>
															</div>
															<div className="form-check form-check-inline">
																<input
																	className="form-check-input"
																	type="checkbox"
																	id="manufacturer"
																	defaultValue="option2"
																/>
																<label className="form-check-label" htmlFor="manufacturer">
																	Manufacturer
																</label>
															</div>
															<div className="form-check form-check-inline">
																<input className="form-check-input" type="checkbox" id="expiry" defaultValue="option2" />
																<label className="form-check-label" htmlFor="expiry">
																	Expiry
																</label>
															</div>
														</div>
													</div>
													<div className="row">
														<div className="col-sm-6 col-12">
															<div className="mb-3">
																<label className="form-label">
																	Warranty
																	<span className="text-danger ms-1">*</span>
																</label>
																<Select className="react-select" options={warrenty} placeholder="Choose" />
															</div>
														</div>
														<div className="col-sm-6 col-12">
															<div className="mb-3 add-product">
																<label className="form-label">
																	Manufacturer
																	<span className="text-danger ms-1">*</span>
																</label>
																<input type="text" className="form-control" />
															</div>
														</div>
													</div>
													<div className="row">
														<div className="col-sm-6 col-12">
															<div className="mb-3">
																<label className="form-label">
																	Manufactured Date
																	<span className="text-danger ms-1">*</span>
																</label>
																<div className="input-groupicon calender-input">
																	<Calendar className="info-img" />
																	<DatePicker className="form-control datetimepicker" placeholder="dd/mm/yyyy" />
																</div>
															</div>
														</div>
														<div className="col-sm-6 col-12">
															<div className="mb-3">
																<label className="form-label">
																	Expiry On
																	<span className="text-danger ms-1">*</span>
																</label>
																<div className="input-groupicon calender-input">
																	<Calendar className="info-img" />
																	<DatePicker className="form-control datetimepicker" placeholder="dd/mm/yyyy" />
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div> */}
					</div>
				</div>
				<div className="col-lg-12">
					<div className="d-flex align-items-center justify-content-end mb-4">
						<button type="button" className="btn btn-secondary me-2" disabled={formState.state.isFormLoading}>
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
								<>Add Product</>
							)}
						</button>
					</div>
				</div>
			</form>
		</>
	);
}
