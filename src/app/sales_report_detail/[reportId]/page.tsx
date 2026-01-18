import { redirect } from 'next/navigation';

import { orderItemFindById } from '@/_lib/order_item';
import { convertTo } from '@/_lib/utils';
import { all_routes as routes } from '@/components/core/data/all_routes';
import Footer from '@/components/partials/footer';
import SalesReportDetailComponents from '@/components/sales_report_detail/SalesReportDetailComponent';
import CollapseIcon from '@/components/tooltip-content/collapse';

export default async function Page({
	params,
	searchParams,
}: {
	params: Promise<{ reportId: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { reportId: p_reportId } = await params;
	const reportId = convertTo.number(p_reportId);

	const sParams = await searchParams;
	const tenantId = convertTo.number(sParams.tenant_id);
	if (reportId === null || tenantId === null) return redirect(routes.index);

	const { result, error } = await orderItemFindById(reportId, tenantId);

	return (
		<div>
			<div className="page-wrapper">
				<div className="content">
					<div className="page-header">
						<div className="add-item d-flex">
							<div className="page-title">
								<h4>Invoice Report </h4>
							</div>
						</div>
						<ul className="table-top-head">
							<CollapseIcon />
						</ul>
					</div>

					{error === null ? <SalesReportDetailComponents id={reportId} data={result!} /> : <p>{error}</p>}
				</div>
				<Footer />
			</div>
		</div>
	);
}
