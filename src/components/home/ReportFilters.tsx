'use client';
import { ConfigProvider, DatePicker, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { Download } from 'react-feather';
const { RangePicker } = DatePicker;

import {
	OnChangeSelectedStore,
	OnClickGenerateReport,
	OnDateRangeOk,
	OnDismissExportError,
	OnSetDateRange,
	OnTagSelect,
	QuickFilterTag,
} from '@/_classes/HomeDashboardEvent';
import SelectVariety from '@/components/inventory/selectVariety';
import { useHomeDashboard } from '@/components/provider/HomeDashboardProvider';

export default function ReportFilters() {
	// Because we use Date object from backend, we need to prevent hydration
	// by checking if the the component already mounted or not
	const [isMounted, setIsMounted] = useState(false);
	const dashboardCtx = useHomeDashboard();
	const singleSelectedTag = dashboardCtx.state.singleSelectedTag;
	const stores = dashboardCtx.stores;
	const dateRange = dashboardCtx.state.dateRanges;
	const isStateLoading = dashboardCtx.isLoading;
	const isExporting = dashboardCtx.isExporting;
	const exportError = dashboardCtx.exportError;
	const onEvent = dashboardCtx.onEvent;

	useEffect(() => setIsMounted(true), []);
	if (!isMounted) return null;

	const tagsData = Object.values(QuickFilterTag);

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
					<div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }} role="status" />
					<span style={{ color: '#fff', fontSize: '1rem', fontWeight: 500 }}>Generating report...</span>
				</div>
			)}

			<div className="card">
				<div className="card-body">
					<form onSubmit={e => e.preventDefault()}>
						<div className="row align-items-end g-3 mb-3">
							<div className="col-md-5">
								<label className="form-label">Choose Date</label>
								<div className="date-picker-centered" style={{ height: '38px' }}>
									<ConfigProvider theme={{ token: { colorPrimary: '#fe9f43' } }}>
										<RangePicker
											value={dateRange}
											showTime={{ format: 'HH:mm' }}
											format="YYYY-MM-DD HH:mm"
											onChange={(dates, dateString) => {
												if (dates) onEvent(new OnSetDateRange([dates[0], dates[1]], dateString));
											}}
											disabled={isStateLoading || isExporting}
											onOk={v => {
												onEvent(new OnDateRangeOk(v));
												onEvent(new OnTagSelect(QuickFilterTag.Custom, false));
											}}
											className="h-100 w-100"
										/>
									</ConfigProvider>
								</div>
							</div>

							<div className="col-md-5">
								<label className="form-label">Store</label>
								<SelectVariety
									className=""
									disabled={isStateLoading}
									onChange={newValue => onEvent(new OnChangeSelectedStore(newValue.value))}
									options={[...stores, { value: '0', label: 'Unselect' }]}
								/>
							</div>

							<div className="col-md-2">
								<button
									className="btn btn-primary w-100"
									type="button"
									disabled={isStateLoading || isExporting}
									onClick={() => onEvent(new OnClickGenerateReport())}
								>
									{isExporting ? (
										'Exporting...'
									) : (
										<>
											<Download size={16} className="me-1" />
											Export
										</>
									)}
								</button>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<label className="form-label">Quick Filter</label>
								<div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
									<ConfigProvider theme={{ token: { colorPrimary: '#fe9f43' } }}>
										{tagsData.map(tag => (
											<Tag.CheckableTag
												key={tag}
												checked={singleSelectedTag === tag}
												onChange={checked => onEvent(new OnTagSelect(tag, checked))}
												style={{
													height: '32px',
													lineHeight: '32px',
													padding: '0 12px',
													fontSize: '13px',
													margin: 0,
												}}
											>
												{tag}
											</Tag.CheckableTag>
										))}
									</ConfigProvider>
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
					<div className="toast-body">{exportError ?? 'Something went wrong while exporting. Please try again.'}</div>
				</div>
			</div>
		</>
	);
}
