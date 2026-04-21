import { Constants } from '@/components/core/data/constant';
import ManageStocksComponents from '@/components/manage_stocks/ManageStocksComponents';
import Footer from '@/components/partials/footer';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';
import { cookies } from 'next/headers';

import { PlusCircle } from 'react-feather';

// export default function ManageStock({ searchParams }: { searchParams: Promise<{ storeId: string | undefined }> }) {
export default async function ManageStock() {
	/*
		1. When user click manage_stocks from navbar then by default there is no id could be detected
		2. Check cookie session
		3. If cookie session still valid get the last cookie session id, even the user change the
			we don't care because the request for get the stocks will be fail.
		4a. If the request fail then get all user store -> 5
		4b. If the request success then just display all current store stocks -> end
		5. After get all user store, then make user select what want to load
	 */

	const cookieStore = await cookies();
	const token = cookieStore.get(Constants.CookieKey.enterprisePOS)?.value ?? '';

	return (
		<>
			<div className="page-wrapper">
				<div className="content">
					<div className="page-header">
						<div className="add-item d-flex">
							<div className="page-title">
								<h4>Manage Stocks</h4>
								<h6>Manage your store stocks</h6>
							</div>
						</div>
						<ul className="table-top-head">
							<RefreshIcon />
							<CollapseIcon />
						</ul>

						{/* Button for ManageStocksComponent/AddNewItem */}
						<div className="page-btn">
							<button
								className="btn btn-primary py-1.5 d-flex align-items-center"
								data-bs-toggle="modal"
								data-bs-target="#add-units"
							>
								<PlusCircle width={13} height={13} className="ti ti-circle-plus me-1"></PlusCircle>
								Add New
							</button>
						</div>
					</div>
					<ManageStocksComponents token={token} />
				</div>
				<Footer />
			</div>
		</>
	);
}
