'use client';

import Link from 'next/link';

import CategoryList from '@/components/category_list/CategoryList';
import Footer from '@/components/partials/footer';
import CollapseIcon from '@/components/tooltip-content/collapse';
import { default as RefreshIcon, default as TooltipIcons } from '@/components/tooltip-content/refresh';

export default function Page() {
	return (
		<div>
			<div className="page-wrapper">
				<div className="content">
					<div className="page-header">
						<div className="add-item d-flex">
							<div className="page-title">
								<h4 className="fw-bold">Category</h4>
								<h6>Manage your categories</h6>
							</div>
						</div>
						<ul className="table-top-head">
							<TooltipIcons />
							<RefreshIcon />
							<CollapseIcon />
						</ul>
						<div className="page-btn">
							<Link href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-category">
								<i className="ti ti-circle-plus me-1"></i>
								Add Category
							</Link>
						</div>
					</div>
					{/* /product list */}
					<CategoryList />
					{/* /product list */}
				</div>
				<Footer />
			</div>
		</div>
	);
}
