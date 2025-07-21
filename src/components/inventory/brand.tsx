'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const Brand = () => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const product = [
		{ value: 'choose', label: 'Choose' },
		{ value: 'boldV3.2', label: 'Bold V3.2' },
		{ value: 'nikeJordan', label: 'Nike Jordan' },
		{ value: 'iphone14Pro', label: 'Iphone 14 Pro' },
	];
	const category = [
		{ value: 'choose', label: 'Choose' },
		{ value: 'laptop', label: 'Laptop' },
		{ value: 'electronics', label: 'Electronics' },
		{ value: 'shoe', label: 'Shoe' },
	];
	const status = [
		{ value: 'choose', label: 'Choose' },
		{ value: 'lenovo', label: 'Lenovo' },
		{ value: 'bolt', label: 'Bolt' },
		{ value: 'nike', label: 'Nike' },
	];

	return (
		<div className="modal fade" id="view-notes">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="page-wrapper-new p-0">
						<div className="content">
							<div className="modal-header border-0 custom-modal-header">
								<div className="page-title">
									<h4>Import Product</h4>
								</div>
								<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">×</span>
								</button>
							</div>
							<div className="modal-body custom-modal-body">
								<form>
									<div className="row">
										<div className="col-lg-4 col-sm-6 col-12">
											<div className="input-blocks">
												<label>Product</label>
												{mounted && <Select options={product} classNamePrefix="react-select" placeholder="Choose" />}
											</div>
										</div>
										<div className="col-lg-4 col-sm-6 col-12">
											<div className="input-blocks">
												<label>Category</label>
												{mounted && <Select options={category} classNamePrefix="react-select" placeholder="Choose" />}
											</div>
										</div>
										<div className="col-lg-4 col-sm-6 col-12">
											<div className="input-blocks">
												<label>Status</label>
												{mounted && <Select options={status} classNamePrefix="react-select" placeholder="Choose" />}
											</div>
										</div>
										<div className="col-lg-12 col-sm-6 col-12">
											<div className="row">
												<div>
													<div className="modal-footer-btn download-file">
														<a href="/sample.csv" className="btn btn-submit" download>
															Download Sample File
														</a>
													</div>
												</div>
											</div>
										</div>
										<div className="col-lg-12">
											<div className="input-blocks image-upload-down">
												<label>Upload CSV File</label>
												<div className="image-upload download">
													<input type="file" />
													<div className="image-uploads">
														<img src="/assets/img/download-img.png" alt="img" />
														<h4>
															Drag and drop a <span>file to upload</span>
														</h4>
													</div>
												</div>
											</div>
										</div>
										<div className="col-lg-12 col-sm-6 col-12">
											<div className="mb-3">
												<label className="form-label">Created by</label>
												<input type="text" className="form-control" />
											</div>
										</div>
									</div>
									<div className="col-lg-12">
										<div className="mb-3 input-blocks">
											<label className="form-label">Description</label>
											<textarea className="form-control" maxLength={60} />
											<p className="mt-1">Maximum 60 Characters</p>
										</div>
									</div>
									<div className="col-lg-12">
										<div className="modal-footer-btn">
											<button type="button" className="btn btn-cancel me-2" data-bs-dismiss="modal">
												Cancel
											</button>
											<button type="submit" className="btn btn-submit">
												Submit
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Brand;
