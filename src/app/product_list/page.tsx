import Link from 'next/link';
import { Download } from 'react-feather';

import { all_routes as routes } from '@/components/core/data/all_routes';
import Brand from '@/components/inventory/brand';
import ProductList from '@/components/product_list/ProductList';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';
import TooltipIcons from '@/components/tooltip-content/tooltipIcons';

export default async function ProductListComponent({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const param = await searchParams;
	const limit = Number(param.limit) || 10; // By default it's 10 warehouse items per page
	const page = Number(param.page) || 1;

	return (
		<>
			<div className="page-wrapper">
				<div className="content">
					<div className="page-header">
						<div className="add-item d-flex">
							<div className="page-title">
								<h4>Product List</h4>
								<h6>Manage your products</h6>
							</div>
						</div>
						<ul className="table-top-head">
							<TooltipIcons />
							<RefreshIcon />
							<CollapseIcon />
						</ul>
						<div className="page-btn">
							<Link href={routes.addProduct} className="btn btn-primary">
								<i className="ti ti-circle-plus me-1"></i>
								Add New Product
							</Link>
						</div>
						<div className="page-btn import">
							<Link href="#" className="btn btn-secondary color" data-bs-toggle="modal" data-bs-target="#view-notes">
								<Download className="feather me-2" />
								Import Product
							</Link>
						</div>
					</div>
					<ProductList limit={limit} page={page} />
					<Brand />
				</div>
			</div>
			<>
				{/* delete modal */}
				<div className="modal fade" id="delete-modal">
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="page-wrapper-new p-0">
								<div className="content p-5 px-3 text-center">
									<span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2">
										<i className="ti ti-trash fs-24 text-danger" />
									</span>
									<h4 className="fs-20 text-gray-9 fw-bold mb-2 mt-1">Delete Product</h4>
									<p className="text-gray-6 mb-0 fs-16">Are you sure you want to delete product?</p>
									<div className="modal-footer-btn mt-3 d-flex justify-content-center">
										<button
											type="button"
											className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
											data-bs-dismiss="modal"
										>
											Cancel
										</button>
										<button type="button" className="btn btn-primary fs-13 fw-medium p-2 px-3" data-bs-dismiss="modal">
											Yes Delete
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		</>
	);
}
