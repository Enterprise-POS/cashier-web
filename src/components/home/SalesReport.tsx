'use client';
import { Pagination, Table, Tooltip } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Delete, Eye } from 'react-feather';

import {
	GetSalesReport,
	OnClickDeleteInvoiceBtn,
	OnClickErrorToastCloseButton,
	OnClickRefreshBtn,
} from '@/_classes/HomeDashboardEvent';
import { OrderItem } from '@/_classes/OrderItem';
import dayjs from '@/_lib/dayjs';
import { formatIDR } from '@/_lib/utils';
import { all_routes as routes } from '@/components/core/data/all_routes';
import DeleteInvoiceModal from '@/components/home/DeleteInvoiceModal';
import { useHomeDashboard } from '@/components/provider/HomeDashboardProvider';

export default function SalesReport() {
	const {
		state,
		orderItems,
		isLoading,
		onEvent,
		isError,
		errorMessage,
		selectedTenantId,
		tobeDeletedInvoiceId,
		isDeletingInvoice,
	} = useHomeDashboard();
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
			render: (id: number, orderItem: OrderItem) =>
				dayjs.utc(orderItem.createdAt).local().format('ddd D MMM, YYYY - h:mm A'),
		},
		{
			title: 'Action',
			dataIndex: 'id',
			render: (id: number) => {
				if (id === tobeDeletedInvoiceId && isDeletingInvoice) {
					return <p className="fst-italic text-muted">— deleting...</p>;
				} else {
					return (
						<div className="action-table-data">
							<div className="edit-delete-action">
								<Tooltip title={`See transaction detail for id ${id}`} placement="left">
									<Link className="me-2 p-2" href={routes.salesReportDetail + `/${id}?tenant_id=${selectedTenantId}`}>
										<Eye />
									</Link>
								</Tooltip>
								<Tooltip title={`Delete transaction for id ${id}`}>
									<Link
										className="me-2 p-2"
										href="#"
										data-bs-toggle="modal"
										data-bs-target="#delete-invoice"
										onClick={() => onEvent(new OnClickDeleteInvoiceBtn(id))}
									>
										<Delete />
									</Link>
								</Tooltip>
							</div>
						</div>
					);
				}
			},
			sorter: (a: OrderItem, b: OrderItem) => a.createdAt.getTime() - b.createdAt.getTime(),
		},
	];

	return (
		<>
			<div className="card table-list-card hide-search">
				<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
					<div>
						<h4>Sales Report</h4>
					</div>
					<ul className="table-top-head">
						<li>
							<Tooltip title="Refresh">
								<Link href="#" onClick={() => onEvent(new OnClickRefreshBtn())}>
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
			<DeleteInvoiceModal />
		</>
	);
}
