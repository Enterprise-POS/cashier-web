'use client';

import EditStockInfoComponent from '@/components/edit_store_products/EditStockInfoComponent';
import Footer from '@/components/partials/footer';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';
import TooltipIcons from '@/components/tooltip-content/tooltipIcons';

export default function StockAdjustment() {
	return (
		<>
			<div className="page-wrapper">
				<div className="content">
					<div className="page-header">
						<div className="add-item d-flex">
							<div className="page-title">
								<h4>Edit Store Product Info</h4>
								<h6>You can edit per store items info. Make sure selected store is correct</h6>
							</div>
						</div>
						<ul className="table-top-head">
							<TooltipIcons />
							<RefreshIcon />
							<CollapseIcon />
						</ul>
					</div>

					<EditStockInfoComponent />
				</div>
				{/* /product list */}
				<Footer />
			</div>
		</>
	);
}
