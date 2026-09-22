'use client';

import DailyTrendChart from '@/components/home/DailyTrendCharts';
import { useHomeDashboard } from '@/components/provider/HomeDashboardProvider';

export default function SalesAnalytics() {
	const { reportResult, isLoading } = useHomeDashboard();

	const showLoading = isLoading || !reportResult;

	return (
		<div className="col-xl-8 d-flex">
			<div className="card flex-fill flex-fill">
				<div className="card-header d-flex justify-content-between align-items-center">
					<h5 className="card-title mb-0">Sales Analytics</h5>
					{/* <div className="graph-sets">
						<div className="dropdown dropdown-wraper">
							<button
								className="btn btn-white btn-sm dropdown-toggle d-flex align-items-center"
								type="button"
								id="dropdown-sales"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								<Calendar className="feather-14" />
								2023
							</button>
							<ul className="dropdown-menu" aria-labelledby="dropdown-sales">
								<li>
									<Link href="#" className="dropdown-item">
										2023
									</Link>
								</li>
								<li>
									<Link href="#" className="dropdown-item">
										2022
									</Link>
								</li>
								<li>
									<Link href="#" className="dropdown-item">
										2021
									</Link>
								</li>
							</ul>
						</div>
					</div> */}
				</div>
				<div className="card-body pt-1 pb-0">
					{showLoading ? <SalesAnalyticsSkeleton /> : <DailyTrendChart report={reportResult} />}
				</div>
			</div>
		</div>
	);
}

function SalesAnalyticsSkeleton() {
	return (
		<div className="d-flex align-items-center justify-content-center" style={{ height: 350 }}>
			<div className="text-center">
				<div className="spinner-border text-primary" role="status" style={{ width: 32, height: 32 }}>
					<span className="visually-hidden">Loading...</span>
				</div>
				<div className="text-muted small mt-2">Loading sales data…</div>
			</div>
		</div>
	);
}
