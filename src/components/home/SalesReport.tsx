'use client';
import { Pagination, Table, TableColumnsType, TableProps, Tooltip } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Delete, Eye } from 'react-feather';

import {
	GetSalesReport,
	OnChangeSalesReportSort,
	OnClickDeleteInvoiceBtn,
	OnClickErrorToastCloseButton,
	OnClickRefreshBtn,
} from '@/_classes/HomeDashboardEvent';
import { OrderItem } from '@/_classes/OrderItem';
import { PaymentStatus } from '@/_interface/PaymentStatus';
import { PaymentType } from '@/_interface/PaymentType';
import type { SortState } from '@/_interface/QueryFilter';
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

	const getSortOrder = (column: SortState['column']) => {
		const sort = state.sorts.find(current => current.column === column);
		return sort ? (sort.ascending ? 'ascend' : 'descend') : null;
	};

	const handleTableChange: TableProps<OrderItem>['onChange'] = (_pagination, _filters, tableSorter) => {
		const activeSorters = Array.isArray(tableSorter) ? tableSorter : [tableSorter];
		const dateSorter = activeSorters.find(sorter => {
			const fieldName = Array.isArray(sorter.field) ? sorter.field.at(0)?.toString() : sorter.field?.toString();
			return sorter.columnKey?.toString() === 'created_at' || fieldName === 'createdAt';
		});

		const isAscending = dateSorter?.order === 'ascend';
		const sorts: SortState[] = [{ column: 'created_at', ascending: isAscending }];

		onEvent(new OnChangeSalesReportSort(sorts));
	};

	const columns: TableColumnsType<OrderItem> = [
		{
			title: 'ID',
			dataIndex: 'id',
		},
		{
			title: 'Cash-in',
			dataIndex: 'purchasedPrice',
			render: (purchasedPrice: number) => formatIDR(purchasedPrice),
		},
		// {
		// 	title: 'Sub Total',
		// 	dataIndex: 'subTotal',
		// 	render: (subTotal: number) => formatIDR(subTotal),
		// },
		{
			title: 'Revenue',
			dataIndex: 'totalAmount',
			render: (totalAmount: number) => formatIDR(totalAmount),
		},
		{
			title: 'Change',
			dataIndex: 'id',
			render: (id: number, orderItem: OrderItem) => formatIDR(orderItem.purchasedPrice - orderItem.totalAmount),
		},
		{
			title: 'Payment Status',
			dataIndex: 'paymentStatus',
			render: (status: string | PaymentStatus) => PaymentStatus[status as keyof typeof PaymentStatus],
		},
		{
			title: 'Method',
			dataIndex: 'paymentType',
			render: (type: PaymentType) => type,
		},
		{
			title: 'Date',
			key: 'created_at',
			dataIndex: 'createdAt',
			sorter: true,
			sortDirections: ['descend', 'ascend', 'descend'],
			sortOrder: getSortOrder('created_at'),
			render: (_: unknown, orderItem: OrderItem) =>
				dayjs.utc(orderItem.createdAt).local().format('ddd D MMM, YYYY - H:mm'),
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
					</ul>
				</div>

				<div className="table-responsive">
					<Table<OrderItem>
						rowKey={'id'}
						loading={isLoading}
						pagination={false}
						columns={columns}
						dataSource={dataSource}
						onChange={handleTableChange}
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
