'use client';
import ManageStocksComponents from '@/components/manage_stocks/ManageStocksComponents';
import Footer from '@/components/partials/footer';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';
import TooltipIcons from '@/components/tooltip-content/tooltipIcons';

import Link from 'next/link';

// export default function ManageStock({ searchParams }: { searchParams: Promise<{ storeId: string | undefined }> }) {
export default function ManageStock() {
	/*
		1. When user click manage_stocks from navbar then by default there is no id could be detected
		2. Check cookie session
		3. If cookie session still valid get the last cookie session id, even the user change the
			we don't care because the request for get the stocks will be fail.
		4a. If the request fail then get all user store -> 5
		4b. If the request success then just display all current store stocks -> end
		5. After get all user store, then make user select what want to load
	 */

	return (
		<>
			<div className="page-wrapper">
				<div className="content">
					<div className="page-header">
						<div className="add-item d-flex">
							<div className="page-title">
								<h4>Manage Stock</h4>
								<h6>Manage your stock</h6>
							</div>
						</div>
						<ul className="table-top-head">
							<TooltipIcons />
							<RefreshIcon />
							<CollapseIcon />
						</ul>
						<div className="page-btn">
							<Link href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-units">
								<i className="ti ti-circle-plus me-1"></i>
								Add New
							</Link>
						</div>
					</div>
					<ManageStocksComponents />
				</div>
				<Footer />
			</div>
		</>
	);
}
