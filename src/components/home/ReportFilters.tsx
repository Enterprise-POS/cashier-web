'use client';
import { ConfigProvider, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
const { RangePicker } = DatePicker;

import { Download } from 'react-feather';

import {
	OnChangeSelectedStore,
	OnClickGenerateReport,
	OnDateRangeOk,
	OnDismissExportError,
	OnSetDateRange,
} from '@/_classes/HomeDashboardEvent';
import SelectVariety from '@/components/inventory/selectVariety';
import { useHomeDashboard } from '@/components/provider/HomeDashboardProvider';

export default function ReportFilters() {
	const dashboardCtx = useHomeDashboard();
	const stores = dashboardCtx.stores;
	const dateRange = dashboardCtx.state.dateRanges;
	const isStateLoading = dashboardCtx.isLoading;
	const isExporting = dashboardCtx.isExporting;
	const exportError = dashboardCtx.exportError;
	const onEvent = dashboardCtx.onEvent;

	// Because we use Date object from backend, we need to prevent hydration
	// by checking if the the component already mounted or not
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => setIsMounted(true), []);
	if (!isMounted) return null;

	return (
		<>
			{isExporting && (
				<div
					style={{
						position: 'fixed',
						inset: 0,
						backgroundColor: 'rgba(0, 0, 0, 0.45)',
						zIndex: 9999,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '12px',
					}}
				>
					<div
						className="spinner-border text-light"
						style={{ width: '3rem', height: '3rem' }}
						role="status"
					/>
					<span style={{ color: '#fff', fontSize: '1rem', fontWeight: 500 }}>
						Generating report...
					</span>
				</div>
			)}

			<div className="card">
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
														showTime={{ format: 'HH:mm' }}
														format="YYYY-MM-DD HH:mm"
														onChange={(dates, dateString) => {
															if (dates) {
																onEvent(new OnSetDateRange([dates[0], dates[1]], dateString));
															}
														}}
														disabled={isStateLoading || isExporting}
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
												className=""
												disabled={isStateLoading}
												onChange={newValue => onEvent(new OnChangeSelectedStore(newValue.value))}
												options={[...stores, { value: '0', label: 'Unselect' }]}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-2">
								<div className="mb-3">
									<button
										className="btn btn-primary w-100"
										type="button"
										disabled={isStateLoading || isExporting}
										onClick={() => onEvent(new OnClickGenerateReport())}
									>
										{isExporting ? (
											'Exporting...'
										) : (
											<><Download size={16} className="me-1" />Export to Excel</>
										)}
									</button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>

			{/* Export error toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					className={`toast ${exportError ? 'show' : ''} colored-toast`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-danger text-fixed-white">
						<strong className="me-auto">Export Failed</strong>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={() => onEvent(new OnDismissExportError())}
						/>
					</div>
					<div className="toast-body">
						{exportError ?? 'Something went wrong while exporting. Please try again.'}
					</div>
				</div>
			</div>
		</>
	);
}
