'use client';
import { Pagination, Table, Tooltip } from 'antd';
import Link from 'next/link';
import { Eye } from 'react-feather';
import dayjs from 'dayjs';

import { OrderItem } from '@/_classes/OrderItem';
import { all_routes as routes } from '@/components/core/data/all_routes';
import { formatIDR } from '@/_lib/utils';
import { useHomeDashboard } from '@/components/provider/HomeDashboardProvider';
import { useState, useEffect } from 'react';
import { GetSalesReport, OnClickErrorToastCloseButton } from '@/_classes/HomeDashboardEvent';

export default function SalesReport() {
	const { state, orderItems, isLoading, onEvent, isError, errorMessage, selectedTenantId } = useHomeDashboard();
	const pagination = state.pagination;
	const count = state.pagination.total;
	const dataSource = orderItems;

	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => setIsMounted(true), []);
	if (!isMounted) return null;

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			sorter: (a: OrderItem, b: OrderItem) => a.id - b.id,
		},
		{
			title: 'Purchased Price',
			dataIndex: 'purchasedPrice',
			sorter: (a: OrderItem, b: OrderItem) => a.purchasedPrice - b.purchasedPrice,
			render: (purchasedPrice: number) => formatIDR(purchasedPrice),
		},
		{
			title: 'Sub Total',
			dataIndex: 'subTotal',
			sorter: (a: OrderItem, b: OrderItem) => a.subTotal - b.subTotal,
			render: (subTotal: number) => formatIDR(subTotal),
		},
		{
			title: 'Gross Sales',
			dataIndex: 'subTotal',
			sorter: (a: OrderItem, b: OrderItem) => a.totalAmount - b.totalAmount,
			render: (subTotal: number) => formatIDR(subTotal),
		},
		{
			title: 'Change',
			dataIndex: 'id',
			sorter: (a: OrderItem, b: OrderItem) => a.purchasedPrice - a.totalAmount - (b.purchasedPrice - b.totalAmount),
			render: (id: number, orderItem: OrderItem) => formatIDR(orderItem.purchasedPrice - orderItem.totalAmount),
		},
		{
			title: 'Date',
			dataIndex: 'createdAt',
			sorter: (a: OrderItem, b: OrderItem) => a.createdAt.getTime() - b.createdAt.getTime(),
			render: (id: number, orderItem: OrderItem) => dayjs(orderItem.createdAt).format('ddd D MMM, YYYY - h:mm A'),
		},
		{
			title: 'Action',
			dataIndex: 'id',
			render: (id: number) => (
				<div className="action-table-data">
					<div className="edit-delete-action">
						<Tooltip title={`See transactions detail (${id})`} placement="left">
							<Link className="me-2 p-2" href={routes.salesReportDetail + `/${id}?tenant_id=${selectedTenantId}`}>
								<Eye />
							</Link>
						</Tooltip>
					</div>
				</div>
			),
			sorter: (a: OrderItem, b: OrderItem) => a.createdAt.getTime() - b.createdAt.getTime(),
		},
	];

	return (
		<div className="card table-list-card hide-search">
			<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
				<div>
					<h4>Sales Report</h4>
				</div>
				<ul className="table-top-head">
					<li>
						<Tooltip title="Refresh">
							<Link href="#">
								<i className="ti ti-refresh"></i>
							</Link>
						</Tooltip>
					</li>
					<li>
						<Tooltip title="Print Report">
							<Link href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Print">
								<i className="ti ti-printer" />
							</Link>
						</Tooltip>
					</li>
				</ul>
			</div>

			<div className="table-responsive">
				<Table<OrderItem>
					rowKey={'id'}
					loading={isLoading}
					pagination={false}
					columns={columns}
					dataSource={dataSource}
				/>
			</div>
			<div className="d-flex justify-content-center justify-content-md-end py-3 px-3">
				<Pagination
					current={pagination.current}
					pageSize={pagination.pageSize}
					total={count}
					showSizeChanger={false}
					onChange={(page, pageSize) => onEvent(new GetSalesReport(page, pageSize))}
				/>
			</div>

			{/* Error Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					id="liveToast"
					className={`toast ${isError ? 'show' : ''} colored-toast`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-danger text-fixed-white">
						<strong className="me-auto">Warning</strong>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="toast"
							aria-label="Close"
							onClick={() => {
								onEvent(new OnClickErrorToastCloseButton());
							}}
						></button>
					</div>
					<div className="toast-body">
						{isError && errorMessage.length > 0
							? errorMessage
							: 'Something wrong while get report :( Please try again later'}
					</div>
				</div>
			</div>
		</div>
	);
}
