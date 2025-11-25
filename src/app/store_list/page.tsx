import { Metadata } from 'next';
import Link from 'next/link';

import Footer from '@/components/partials/footer';
import StoreListComponent from '@/components/store_list/StoreListComponent';
import ToggleFilterByActivateButton from '@/components/store_list/ToggleFilterByActivateButton';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';
import TooltipIcons from '@/components/tooltip-content/tooltipIcons';

export const metadata: Metadata = {
	title: 'Edit Product',
};

export default function StoreList() {
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
								<h4>Store List</h4>
								<h6>Manage and see store details</h6>
							</div>
						</div>
						<ul className="table-top-head">
							<TooltipIcons />
							<RefreshIcon />
							<CollapseIcon />
							<ToggleFilterByActivateButton />
						</ul>
						<div className="page-btn">
							<Link href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-units">
								<i className="ti ti-circle-plus me-1"></i>
								Add New
							</Link>
						</div>
					</div>
					<StoreListComponent />
				</div>
				<Footer />
			</div>
		</>
	);
}
