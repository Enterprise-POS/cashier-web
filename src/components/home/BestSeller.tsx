'use client';

import { Tooltip } from 'antd';

import { formatIDR } from '@/_lib/utils';
import { useHomeDashboard } from '@/components/provider/HomeDashboardProvider';

export default function BestSeller() {
	const { reportResult, isLoading } = useHomeDashboard();

	const items = reportResult?.topItemsByProfit ?? [];

	return (
		<div className="col-xl-4 d-flex">
			<div className="card flex-fill w-100 mb-4">
				<div className="card-header d-flex justify-content-between align-items-center">
					<h4 className="card-title mb-0">Best Seller</h4>
					{/* <Link href="#" className="btn btn-outline-light btn-sm">
						View All
					</Link> */}
				</div>
				<div className="card-body">
					<div className="table-responsive best-seller-scroll" style={{ maxHeight: 400, overflowY: 'auto' }}>
						<table className="table table-borderless best-seller mb-0">
							<tbody>
								{isLoading ? (
									<BestSellerSkeletonRows />
								) : items.length === 0 ? (
									<tr>
										<td className="text-center text-muted py-4">No sales data for this period</td>
									</tr>
								) : (
									items.map((item, index) => (
										<tr key={`${item.item_name}-${index}`}>
											<td className={index === 0 ? 'pt-0 ps-0' : 'ps-0'} style={{ maxWidth: 0, width: '65%' }}>
												<div className="d-flex align-items-center">
													{/* <Link
														href={routes.index}
														className="avatar avatar-lg me-2 d-flex align-items-center justify-content-center bg-primary-transparent text-primary fw-bold"
														style={{ borderRadius: '50%' }}
													>
														{item.item_name?.charAt(0).toUpperCase() ?? '?'}
													</Link> */}
													<div style={{ minWidth: 0 }}>
														<Tooltip title={item.item_name}>
															<h6 className="fw-medium text-truncate">
																{/* <Link href={routes.index} className="fw-bold">
																{item.item_name}
																</Link> */}
																{item.item_name}
															</h6>
														</Tooltip>
														<p>{formatIDR(item.total_revenue)}</p>
													</div>
												</div>
											</td>
											<td className={index === 0 ? 'pt-0' : ''}>
												<p className="text-gray-9 mb-1">Profit</p>
												<p className="text-gray-9 fw-medium">
													{formatIDR(item.total_profit)}{' '}
													<span className="text-success fs-12">({item.margin_percent.toFixed(1)}%)</span>
												</p>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

function BestSellerSkeletonRows() {
	return (
		<>
			{Array.from({ length: 5 }).map((_, i) => (
				<tr key={i}>
					<td className={i === 0 ? 'pt-0 ps-0' : 'ps-0'}>
						<div className="d-flex align-items-center">
							<div
								className="avatar avatar-lg me-2 placeholder-glow"
								style={{ borderRadius: '50%', overflow: 'hidden' }}
							>
								<span className="placeholder" style={{ display: 'block', width: '100%', height: '100%' }} />
							</div>
							<div className="placeholder-glow" style={{ width: 120 }}>
								<span className="placeholder col-8 mb-1" style={{ display: 'block' }} />
								<span className="placeholder col-5" style={{ display: 'block' }} />
							</div>
						</div>
					</td>
					<td className={i === 0 ? 'pt-0' : ''}>
						<div className="placeholder-glow" style={{ width: 50 }}>
							<span className="placeholder col-10 mb-1" style={{ display: 'block' }} />
							<span className="placeholder col-6" style={{ display: 'block' }} />
						</div>
					</td>
				</tr>
			))}
		</>
	);
}
