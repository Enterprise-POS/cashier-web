import BestSeller from '@/components/home/BestSeller';
import OverviewCards from '@/components/home/OverviewCards';
import ReportFilters from '@/components/home/ReportFilters';
import SalesAnalytics from '@/components/home/SalesAnalytics';
import SalesReport from '@/components/home/SalesReport';
import Footer from '@/components/partials/footer';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';

export default function HomeDashboard({ name }: { name: string }) {
	return (
		<div className="page-wrapper">
			<div className="content">
				<div className="page-header">
					<div className="add-item d-flex">
						<div className="page-title">
							<h4>Hello {name}</h4>
							<h6>How&apos;s your day ? Let&apos;s do our best today !</h6>
						</div>
					</div>
					<ul className="table-top-head">
						<RefreshIcon />
						<CollapseIcon />
					</ul>
				</div>

				<OverviewCards />
				<div className="row">
					<BestSeller />
					<SalesAnalytics />
				</div>
				<ReportFilters />
				<SalesReport />
			</div>
			<Footer />
		</div>
	);
}
