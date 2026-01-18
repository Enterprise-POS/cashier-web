import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

import { convertTo } from '@/_lib/utils';
import SelectVariety from '@/components/inventory/selectVariety';
import { useHomeDashboard } from '@/components/provider/HomeDashboardProvider';

export default function ReportFilters() {
	const dashboardCtx = useHomeDashboard();
	const stores = dashboardCtx.stores;
	const dateRange = dashboardCtx.data.dateRanges;
	const onOk = dashboardCtx.onDateRangeOk;
	const onSetDateRange = dashboardCtx.onSetDateRange;
	const onClickGenerateReport = dashboardCtx.onClickGenerateReport;
	const onChangeSelectedStore = dashboardCtx.onChangeSelectedStore;

	return (
		<div className="card border-0">
			<div className="card-body pb-1">
				<form>
					<div className="row align-items-end">
						<div className="col-lg-10">
							<div className="row">
								<div className="col-md-4">
									<div className="mb-3 d-flex flex-column">
										<label className="form-label">Choose Date&nbsp;</label>
										<div style={{ height: '38px' }}>
											<RangePicker
												value={dateRange}
												showTime={{ format: 'HH:mm' }}
												format="YYYY-MM-DD HH:mm"
												onChange={(dates, dateString) => {
													if (dates) {
														onSetDateRange([dates[0], dates[1]], dateString);
													}
												}}
												onOk={onOk}
												className="h-100"
											/>
										</div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="mb-3">
										<label className="form-label">Store</label>
										<SelectVariety
											onChange={newValue => onChangeSelectedStore(newValue.value)}
											options={[...stores, { value: '0', label: 'Unselect' }]}
										/>
									</div>
								</div>
								{/* <div className="col-md-4">
									<div className="mb-3">
										<label className="form-label">Products</label>
										<SelectVariety options={ProductName} />
									</div>
								</div> */}
							</div>
						</div>
						<div className="col-lg-2">
							<div className="mb-3">
								<button className="btn btn-primary w-100" type="button" onClick={onClickGenerateReport}>
									Generate Report
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
