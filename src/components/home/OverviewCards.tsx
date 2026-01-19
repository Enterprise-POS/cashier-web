'use client';
import { setStringPrefix } from '@/_lib/utils';
import { useHomeDashboard } from '@/components/provider/HomeDashboardProvider';

export default function OverviewCards() {
	const homeDashboardCtx = useHomeDashboard();
	const reportResult = homeDashboardCtx.data.reportResult;

	return (
		<div className="row">
			<div className="col-xl-3 col-sm-6 col-12 d-flex">
				<div className="card border border-success sale-widget flex-fill">
					<div className="card-body d-flex align-items-center">
						<span className="sale-icon bg-success text-white">
							<i className="ti ti-align-box-bottom-left-filled fs-24" />
						</span>
						<div className="ms-2">
							<p className="fw-medium mb-1">Cash-in</p>
							<div>
								<h3>{reportResult !== undefined ? setStringPrefix(reportResult.sumPurchasedPrice, '￥') : '-'}</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="col-xl-3 col-sm-6 col-12 d-flex">
				<div className="card border border-info sale-widget flex-fill">
					<div className="card-body d-flex align-items-center">
						<span className="sale-icon bg-info text-white">
							<i className="ti ti-align-box-bottom-left-filled fs-24" />
						</span>
						<div className="ms-2">
							<p className="fw-medium mb-1">Gross Sales</p>
							<div>
								<h3>{reportResult !== undefined ? setStringPrefix(reportResult.sumTotalAmount, '￥') : '-'}</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="col-xl-3 col-sm-6 col-12 d-flex">
				<div className="card border border-orange sale-widget flex-fill">
					<div className="card-body d-flex align-items-center">
						<span className="sale-icon bg-orange text-white">
							<i className="ti ti-moneybag fs-24" />
						</span>
						<div className="ms-2">
							<p className="fw-medium mb-1">Change</p>
							<div>
								<h3>{reportResult !== undefined ? setStringPrefix(reportResult.getChanges(), '￥') : ''}</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="col-xl-3 col-sm-6 col-12 d-flex">
				<div className="card border border-danger sale-widget flex-fill">
					<div className="card-body d-flex align-items-center">
						<span className="sale-icon bg-danger text-white">
							<i className="ti ti-alert-circle-filled fs-24" />
						</span>
						<div className="ms-2">
							<p className="fw-medium mb-1">Total Transactions</p>
							<div>
								<h3>{reportResult !== undefined ? reportResult.sumTransactions : '-'}</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
