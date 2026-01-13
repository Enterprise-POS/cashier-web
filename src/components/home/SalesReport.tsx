import Link from 'next/link';

import { useHomeDashboard } from '@/components/provider/HomeDashboardProvider';
import TooltipIcons from '@/components/tooltip-content/tooltipIcons';

export default function SalesReport() {
	const dashboardCtx = useHomeDashboard();

	return (
		<div className="card table-list-card hide-search">
			<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
				<div>
					<h4>Sales Report</h4>
				</div>
				<ul className="table-top-head">
					<TooltipIcons />
					<li>
						<Link href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Print">
							<i className="ti ti-printer" />
						</Link>
					</li>
				</ul>
			</div>

			<div className="card-body">
				<div className="table-responsive">{/* <Table columns={columns} dataSource={filteredData} /> */}</div>
			</div>
		</div>
	);
}
