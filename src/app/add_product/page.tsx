import AddProductForm from '@/components/add_product/AddProductForm';
import { all_routes } from '@/components/core/data/all_routes';
import Footer from '@/components/partials/footer';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';

import Link from 'next/link';
import { ArrowLeft } from 'react-feather';

export default function AddProductComponent() {
	const route = all_routes;

	return (
		<>
			<div className="page-wrapper">
				<div className="content">
					<div className="page-header">
						<div className="add-item d-flex">
							<div className="page-title">
								<h4>Create Product</h4>
								<h6>Create new product</h6>
							</div>
						</div>
						<ul className="table-top-head">
							<RefreshIcon />
							<CollapseIcon />
							<li>
								<div className="page-btn">
									<Link href={route.productList} className="btn btn-secondary">
										<ArrowLeft className="me-2" />
										Back to Product
									</Link>
								</div>
							</li>
						</ul>
					</div>
					{/* /add */}
					<AddProductForm />
					{/* /add */}
				</div>
				<Footer />
			</div>
			{/* <Addunits />
			<AddCategory />
			<AddVariant />
			<AddBrand />
			<AddVarientNew /> */}
			{/* <div className="modal fade" id="delete-modal">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="page-wrapper-new p-0">
							<div className="content p-5 px-3 text-center">
								<span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2">
									<i className="ti ti-trash fs-24 text-danger"></i>
								</span>
								<h4 className="fs-20 fw-bold mb-2 mt-1">Delete Attribute</h4>
								<p className="mb-0 fs-16">Are you sure you want to delete Attribute?</p>
								<div className="modal-footer-btn mt-3 d-flex justify-content-center">
									<button
										type="button"
										className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
										data-bs-dismiss="modal"
									>
										Cancel
									</button>
									<button type="button" className="btn btn-primary fs-13 fw-medium p-2 px-3">
										Yes Delete
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div> */}
		</>
	);
}
