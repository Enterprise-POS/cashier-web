import Link from 'next/link';
import { Download } from 'react-feather';

import { all_routes as routes } from '@/components/core/data/all_routes';
import Brand from '@/components/inventory/brand';
import Footer from '@/components/partials/footer';
import ProductList from '@/components/product_list/ProductList';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';
import TooltipIcons from '@/components/tooltip-content/tooltipIcons';

export default async function ProductListComponent({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const param = await searchParams;
	const limit = Number(param.limit) || 10; // By default it's 10 warehouse items per page
	const page = Number(param.page) || 1;

	return (
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
			<Footer />
		</div>
	);
}
