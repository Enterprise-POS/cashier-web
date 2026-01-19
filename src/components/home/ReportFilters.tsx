'use client';
import { ConfigProvider, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
const { RangePicker } = DatePicker;

import {
	OnChangeSelectedStore,
	OnClickGenerateReport,
	OnDateRangeOk,
	OnSetDateRange,
} from '@/_classes/HomeDashboardEvent';
import SelectVariety from '@/components/inventory/selectVariety';
import { useHomeDashboard } from '@/components/provider/HomeDashboardProvider';

export default function ReportFilters() {
	const dashboardCtx = useHomeDashboard();
	const stores = dashboardCtx.stores;
	const dateRange = dashboardCtx.data.dateRanges;
	const isStateLoading = dashboardCtx.isStateLoading;
	const onEvent = dashboardCtx.onEvent;

	// Because we use Date object from backend, we need to prevent hydration
	// by checking if the the component already mounted or not
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => setIsMounted(true), []);
	if (!isMounted) return null;

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
											<ConfigProvider theme={{ token: { colorPrimary: '#fe9f43' } }}>
												<RangePicker
													value={dateRange}
													showTime={{ format: 'HH:mm' }} // Will allow user to select date with hours and minute
													format="YYYY-MM-DD HH:mm"
													onChange={(dates, dateString) => {
														if (dates) {
															onEvent(new OnSetDateRange([dates[0], dates[1]], dateString));
														}
													}}
													disabled={isStateLoading}
													onOk={v => onEvent(new OnDateRangeOk(v))}
													className="h-100"
												/>
											</ConfigProvider>
										</div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="mb-3">
										<label className="form-label">Store</label>
										<SelectVariety
											disabled={isStateLoading}
											onChange={newValue => onEvent(new OnChangeSelectedStore(newValue.value))}
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
								<button
									className="btn btn-primary w-100"
									type="button"
									disabled={isStateLoading}
									onClick={() => onEvent(new OnClickGenerateReport())}
								>
									{isStateLoading ? 'Generating...' : 'Generate Report'}
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
